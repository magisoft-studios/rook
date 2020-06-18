import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cards from './Cards'
import GameInfoArea from './GameInfoArea';
import Card from './Card';
import PlayerHand from './PlayerHand';
import OpponentCard from './OpponentCard';
import CardTable from './CardTable';
import AppContext from './ContextLib';
import PlayerStates from './PlayerStates';
import GameStates from './GameStates';
import PlayerActions from './PlayerActions';
import Cam from './Cam.js';
import RemoteCam from './RemoteCam.js';
import CamConn from './CamConn.js';
import socketIOClient from 'socket.io-client';
import SocketMsg from "./SocketMsg";
import './css/Game.scss';

const RESIZE_TIMEOUT = 100;

class Game extends Component {
    constructor(props) {
        super(props);
        this.playerHandRef = React.createRef();
        this.cardTableRef = React.createRef();
        this.posns = {
            bottomPlayerPosn: "",
            leftPlayerPosn: "",
            topPlayerPosn: "",
            rightPlayerPosn: "",
        };
        this.state = {
            gameId: props.gameId,
            playerPosn: props.playerPosn,
            gameData: props.gameData,
            initStream: false,
            streams: {
                player1: null,
                player2: null,
                player3: null,
                player4: null,
            },
        }
        this.calcPlayerPosns(props.playerPosn);
        this.socket = null;
        this.camConnMap = new Map();
        this.initCameraConnections(props.sessionId);
        this.sentStreamInitialized = false;
    }

    componentDidMount = async () => {
        console.log(`componentDidMount: window size = ${window.innerWidth} x ${window.innerHeight}`);
        window.addEventListener('resize', () => {
            clearInterval(this.resizeTimer);
            this.resizeTimer = setTimeout(this.handleWindowResize, RESIZE_TIMEOUT);
        });
        await this.initSocketIo();
        await this.sendEnterGame();
    }

    componentWillUnmount() {
        console.log("Component will unmount called!!!");
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(`componentDidUpdate: prevState=${prevState.gameData.state} newState=${this.state.gameData.state}`);
        if ((this.state.gameData.state === GameStates.INIT_STREAM) && !this.sentStreamInitialized) {
            if (this.state.streams[this.posns.bottomPlayerPosn] != null) {
                this.sentStreamInitialized = true;
                this.sendStreamInitialized();
            }
        } else if ((this.state.gameData.state === GameStates.INIT_CONN) &&
            (prevState.gameData.state === GameStates.INIT_STREAM)) {
            this.sendCamOffers();
        }
    }

    handleWindowResize = () => {
        console.log(`handleWindowResize: window size = ${window.innerWidth} x ${window.innerHeight}`);
    }

    initSocketIo = async () => {
        try {
            this.socket = await socketIOClient('/game', {
                transports: ['websocket'],
                query: {
                    sessionId: this.context.session.id,
                }
            });
            this.socket.on('disconnect', () => {
                console.log(`Disconnected from Game socket`);
            });
            this.socket.on(`message`, this.rcvSocketMsg);
        } catch(error) {
            console.log(`Error initializing socket IO: ${error.message}`);
        }
    }

    rcvSocketMsg = (message) => {
        //console.log(`Received message: ${JSON.stringify(message)}`);
        if (message.source === 'camera') {
            let camConn = this.camConnMap.get(message.fromPlayerPosn);
            camConn.handleMsg(message);
        } else {
            if (message.status === "SUCCESS") {
                switch (message.msgId) {
                    case "gameDataChanged": {
                        this.rcvdGameDataChangedMsg(message);
                        break;
                    }
                    default: {
                        console.log(`Received invalid msgId on Game socket: ${message.msgId}`);
                    }
                }
            } else {
                console.log(`Game socket error: ${message.errorMsg}`);
            }
        }
    }

    sendSocketMsg = async (message) => {
        try {
            message.fromPlayerPosn = this.state.playerPosn;
            await this.socket.emit(`message`, message);
        } catch (error) {
            console.log(`Error sending socket msg: ${error.message}`);
        }
    }

    initCameraConnections = (sessionId) => {
        this.initCamConn(sessionId,"topCamConn", this.posns.topPlayerPosn);
        this.initCamConn(sessionId,"leftCamConn", this.posns.leftPlayerPosn);
        this.initCamConn(sessionId,"rightCamConn", this.posns.rightPlayerPosn);
    }

    initCamConn = (sessionId, name, posn) => {
        let camConn = new CamConn({
            sessionId: sessionId,
            name: name,
            playerPosn: this.state.playerPosn,
            peerPosn: posn,
            gameData: this.state.gameData,
            sendMessage: this.sendSocketMsg,
            handleAddStream: this.handleAddStream,
            handleConnected: this.handleCamConnConnected,
        });
        this.camConnMap.set(posn, camConn);
    }

    rcvdGameDataChangedMsg = (message) => {
        console.log("Received gameDataChanged message");
        console.log(`New game state is ${message.msg.gameData.stateText}`);
        let newState = {
            ...this.state,
            gameData: message.msg.gameData,
        };
        this.setState(newState);
    }

    handleCamConnConnected = async (name) => {
        console.log(`Game: handleCamConnConnected from ${name}`);
        let gameData = this.state.gameData;
        if (gameData.state === GameStates.INIT_CONN) {
            if (this.camConnMap && (this.camConnMap.size === 3)) {
                let allConnected = true;
                this.camConnMap.forEach( (camConn) => {
                    allConnected = allConnected && camConn.connected;
                });

                if (allConnected) {
                    this.sendConnectionsInitialized();
                }
            }
        }
    }

    sendCamOffers = () => {
        switch (this.state.playerPosn) {
            case "player1": {
                // Nothing to do, just wait for offers.
                break;
            }
            case "player2": {
                // Send offer to player 1.
                let camConn = this.camConnMap.get("player1");
                camConn.createAndSendOffer();
                break;
            }
            case "player3": {
                // Send offers to player 1 and player 2.
                let camConn = this.camConnMap.get("player1");
                camConn.createAndSendOffer();
                camConn = this.camConnMap.get("player2");
                camConn.createAndSendOffer();
                break;
            }
            case "player4": {
                // Send offers to player 1, player 2 and player 3.
                let camConn = this.camConnMap.get("player1");
                camConn.createAndSendOffer();
                camConn = this.camConnMap.get("player2");
                camConn.createAndSendOffer();
                camConn = this.camConnMap.get("player3");
                camConn.createAndSendOffer();
                break;
            }
            default: {
                // Nothing to do, just wait for offers.
                break;
            }
        }
    }

    handleStreamIsReady = (mediaStream) => {
        console.log(`Game::handleStreamIsReady for stream ${mediaStream.id}`);
        this.camConnMap.forEach( (camConn) => {
           camConn.streamIsReady(mediaStream);
        });
        let newState = { ...this.state };
        newState.streams[this.posns.bottomPlayerPosn] = mediaStream;
        this.setState(newState);
    }

    handleAddStream = (posn, mediaStream) => {
        console.log(`Game::handleAddStream called for ${posn}`);
        let newState = { ...this.state };
        newState.streams[posn] = mediaStream;
        console.log(`Game::handleAddStream: adding media stream: ${mediaStream.id}`);
        this.setState(newState);
    }

    handleGetGameData = () => {
        this.sendGetGameData();
    }

    sendGetGameData = async () => {
        let socketMsg = new SocketMsg(this.context.session.id);
        socketMsg.msgId = 'getGameData';
        this.sendSocketMsg(socketMsg);
    }

    sendEnterGame = async () => {
        let socketMsg = new SocketMsg(this.context.session.id);
        socketMsg.msgId = 'enterGame';
        this.sendSocketMsg(socketMsg);
    }

    sendStreamInitialized = async () => {
        let socketMsg = new SocketMsg(this.context.session.id);
        socketMsg.msgId = 'streamInitialized';
        this.sendSocketMsg(socketMsg);
    }

    sendConnectionsInitialized = async () => {
        let socketMsg = new SocketMsg(this.context.session.id);
        socketMsg.msgId = 'connectionsInitialized';
        this.sendSocketMsg(socketMsg);
    }

    handlePlayerAction = async (params) => {
        let socketMsg = new SocketMsg(this.context.session.id);
        socketMsg.msgId = 'playerAction';
        socketMsg.msg = {
            action: params.action,
            actionValue: params.value ? params.value : "NA",
        };
        this.sendSocketMsg(socketMsg);
    }

    handleKittyCardClick = async (cardId) => {
        let socketMsg = new SocketMsg(this.context.session.id);
        socketMsg.msgId = 'playerAction';
        socketMsg.msg = {
            action: PlayerActions.TAKE_KITTY_CARD,
            actionValue: cardId,
        };
        this.sendSocketMsg(socketMsg);
    }

    handleCardClick = async (cardId) => {
        let socketMsg = new SocketMsg(this.context.session.id);
        socketMsg.msgId = 'playerAction';
        if (this.state.gameData.state === GameStates.POPULATE_KITTY) {
            socketMsg.msg = {
                action: PlayerActions.PUT_KITTY_CARD,
                actionValue: cardId,
            };
            this.sendSocketMsg(socketMsg);
        } else if (this.state.gameData.state === GameStates.WAIT_FOR_CARD) {
            let gameData = this.state.gameData;
            let playerPosn = this.context.currentGame.playerPosn;
            let player = gameData[playerPosn];
            if (player.state === PlayerStates.PLAY_CARD) {
                if (this.isValidPlay(player, cardId, gameData.trick.suit)) {
                    socketMsg.msg = {
                        action: PlayerActions.PLAY_CARD,
                        actionValue: cardId,
                    };
                    this.sendSocketMsg(socketMsg);
                }
            }
        }
    }

    handleKittyDone = async () => {
        let gameData = this.state.gameData;
        let playerPosn = this.context.currentGame.playerPosn;
        let player = gameData[playerPosn];
        if (gameData.state === GameStates.POPULATE_KITTY) {
            if (player.state === PlayerStates.SETUP_KITTY) {
                let errMsg = "";
                if (gameData.kitty.length === 5) {
                    gameData.kitty.forEach((card) => {
                        if (card.pointValue > 0) {
                            errMsg = "Oops, kitty must not contain any point cards";
                        }
                    });
                } else {
                    errMsg = "Oops, kitty must contain 5 cards!";
                }

                if (errMsg.length === 0) {
                    let socketMsg = new SocketMsg(this.context.session.id);
                    socketMsg.msgId = 'playerAction';
                    socketMsg.msg = {
                        action: PlayerActions.KITTY_DONE,
                    };
                    this.sendSocketMsg(socketMsg);
                } else {
                    this.showErrorToast(errMsg);
                }
            }
        }
    }

    isValidPlay = (player, cardId, trickSuit) => {
        let isValid = false;

        let card = player.cards.find( (card) => {
            return (card.id === cardId);
        })

        // Check if card suit equals trick suit.
        if (trickSuit.length === 0) {
            isValid = true;
        } else {
            if (card.suit === trickSuit) {
                isValid = true;
            } else {
                // Check if player has any cards of that suit.
                let cardOfTrickSuit = player.cards.find((card) => {
                    return (card.suit === trickSuit);
                });

                if (cardOfTrickSuit === undefined) {
                    isValid = true;
                } else {
                    this.showErrorToast("That play is invalid, please follow suit!");
                }
            }
        }
        return isValid;
    }

    calcPlayerPosns(playerPosn) {
        switch (playerPosn) {
            case "player1":
                this.posns.bottomPlayerPosn = "player1";
                this.posns.leftPlayerPosn = "player2";
                this.posns.topPlayerPosn = "player3";
                this.posns.rightPlayerPosn = "player4";
                break;
            case "player2":
                this.posns.bottomPlayerPosn = "player2";
                this.posns.leftPlayerPosn = "player3";
                this.posns.topPlayerPosn = "player4";
                this.posns.rightPlayerPosn = "player1";
                break;
            case "player3":
                this.posns.bottomPlayerPosn = "player3";
                this.posns.leftPlayerPosn = "player4";
                this.posns.topPlayerPosn = "player1";
                this.posns.rightPlayerPosn = "player2";
                break;
            case "player4":
                this.posns.bottomPlayerPosn = "player4";
                this.posns.leftPlayerPosn = "player1";
                this.posns.topPlayerPosn = "player2";
                this.posns.rightPlayerPosn = "player3";
                break;
            default:
                this.posns.bottomPlayerPosn = "player1";
                this.posns.leftPlayerPosn = "player2";
                this.posns.topPlayerPosn = "player3";
                this.posns.rightPlayerPosn = "player4";
                break;
        }
    }

    showErrorToast = (msg) => {
        toast.error(msg, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    createVertOpponentCard(player, index) {
        let cardKey = player + index;
        let wrapperClass = "oppCardVertWrapper";
        let imgClass = "oppCardVert";
        let imgSrc = cards.cardBack;
        return (
            <OpponentCard
                key={cardKey}
                cardKey={cardKey}
                wrapperClass={wrapperClass}
                imgClass={imgClass}
                imgSrc={imgSrc} />
        );
    }

    createHorizOpponentCard(player, index) {
        let cardKey = player + index;
        let wrapperClass = "oppCardHorizWrapper";
        let imgClass = "oppCardHoriz";
        let imgSrc = cards.cardBackHoriz;
        return (
            <OpponentCard
                key={cardKey}
                cardKey={cardKey}
                wrapperClass={wrapperClass}
                imgClass={imgClass}
                imgSrc={imgSrc} />
        );
    }

    getTeamId(playerId) {
        let teamId = "team1";
        if (playerId === "player2" || playerId === "player4") {
            teamId = "team2"
        }
        return teamId;
    }

    getImageClass(player) {
        let imageClass = "playerImage";
        if ((player.state === PlayerStates.DEAL) ||
            (player.state === PlayerStates.BID) ||
            (player.state === PlayerStates.PLAY_CARD))
        {
            imageClass = "selectedPlayerImage";
        }
        return imageClass;
    }


    render() {
        console.log("Game: render");
        let gameData = this.state.gameData;

        let topPlayer = gameData[this.posns.topPlayerPosn];
        let leftPlayer = gameData[this.posns.leftPlayerPosn];
        let rightPlayer = gameData[this.posns.rightPlayerPosn];
        let bottomPlayer = gameData[this.posns.bottomPlayerPosn];

        let topPlayerCardCmpnts = [];
        let leftPlayerCardCmpnts = [];
        let rightPlayerCardCmpnts = [];
        let bottomPlayerCards = [];

        for (let i = 0; i < topPlayer.numCards; i++) {
            leftPlayerCardCmpnts.push(this.createHorizOpponentCard(topPlayer.name, i));
        }

        for (let i = 0; i < leftPlayer.numCards; i++) {
            topPlayerCardCmpnts.push(this.createVertOpponentCard(leftPlayer.name, i));
        }

        for (let i = 0; i < rightPlayer.numCards; i++) {
            rightPlayerCardCmpnts.push(this.createHorizOpponentCard(rightPlayer.name, i));
        }

        let cards = bottomPlayer.cards;
        if (cards) {
            for (let i = 0; i < cards.length; i++) {
                let card = cards[i];
                bottomPlayerCards.push(new Card(card.id, card.name, card.value, card.pointValue, card.suit));
            }
        }

        let topCam = <RemoteCam name="topCam" mediaStream={this.state.streams[this.posns.topPlayerPosn]} />;
        let leftCam = <RemoteCam name="leftCam" mediaStream={this.state.streams[this.posns.leftPlayerPosn]} />;
        let rightCam = <RemoteCam name="rightCam" mediaStream={this.state.streams[this.posns.rightPlayerPosn]} />;

        let bottomCam =
            <Cam
                name="bottomCam"
                initStream={this.state.initStream}
                mediaStream={this.state.streams[this.posns.bottomPlayerPosn]}
                onStreamReady={this.handleStreamIsReady}
                gameDataState={this.state.gameData.state}
                videoSrc={this.context.mediaSettings.videoSrc}
                audioSrc={this.context.mediaSettings.audioSrc}
                audioDst={this.context.mediaSettings.audioDst}
            />;


        return (
            <div className="gameView">
                <div className="gameArea">
                    <GameInfoArea gameData={this.state.gameData} onRefresh={this.handleGetGameData} />
                    <div className="topPlayerArea">
                        {topCam}
                        {/*
                        <div className="topPlayerCardArea">
                            {topPlayerCardCmpnts}
                        </div>
                        */}
                    </div>
                    <div className="leftPlayerArea">
                        {leftCam}
                        {/*
                        <div className="leftPlayerCardArea">
                            {leftPlayerCardCmpnts}
                        </div>
                        */}
                    </div>
                    <CardTable
                        ref={this.cardTableRef}
                        gameData={this.state.gameData}
                        playerPosns={this.posns}
                        onPlayerAction={this.handlePlayerAction}
                        onKittyCardClick={this.handleKittyCardClick}
                        onKittyDone={this.handleKittyDone}>
                    </CardTable>
                    <div className="rightPlayerArea">
                        {rightCam}
                        {/*
                        <div className="rightPlayerCardArea">
                            {rightPlayerCardCmpnts}
                        </div>
                        */}
                    </div>
                    <div className="bottomPlayerArea">
                        {bottomCam}
                        <PlayerHand
                            ref={this.playerHandRef}
                            cardList={bottomPlayerCards}
                            onClick={this.handleCardClick} />
                    </div>
                </div>
                <ToastContainer />
            </div>
        );
    }
}

Game.contextType = AppContext;

export default Game;
