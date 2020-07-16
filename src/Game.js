import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommonCards from './CommonCards';
import RookCards from './RookCards';
import ElementsCards from './ElementsCards';
import GameInfoArea from './GameInfoArea';
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
import MyButton from "./MyButton";
import PlayerCard from "./PlayerCard";

const RESIZE_TIMEOUT = 100;

class Game extends Component {
    constructor(props) {
        super(props);
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
            connectionState: 'initialize',
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
        if (props.gameData.type === "Elements") {
            this.cardDeck = ElementsCards;
        } else {
            this.cardDeck = RookCards;
        }
        this.sentEnterGame = false;
        this.sentStreamInitialized = false;
        this.sentConnectionsInitialized = false;
        this.sentCamOffers = false;
    }

    /* Changing to the Lobby tab causes the Game to unmount.
       Coming back to the Game tab causes the constructor to get re-run and
       the componentDidMount method to get called.
     */
    componentDidMount = async () => {
        console.log(`Game: componentDidMount: window size = ${window.innerWidth} x ${window.innerHeight}`);
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        window.addEventListener('unload', this.handleUnload);
        //window.addEventListener('resize', () => {
        //    clearInterval(this.resizeTimer);
        //    this.resizeTimer = setTimeout(this.handleWindowResize, RESIZE_TIMEOUT);
        //});
        if (this.socket === null) {
            console.log(`Game: componentDidMount: initializing socket IO`);
            await this.initSocketIo();
        }
        this.sendGetGameData();
    }

    /* This gets called when we switch to the Lobby tab while the game is in progress. */
    componentWillUnmount() {
        console.log("Game: componentWillUnmount");
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        window.removeEventListener('unload', this.handleUnload);
    }

    handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = "Are you sure you want to exit the game?";
    }

    handleUnload = (event) => {
        console.log("Game: handleUnload, sending exit msg, disconnecting socket");
        this.handleExit();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(`Game: componentDidUpdate: prevState=${prevState.gameData.state} newState=${this.state.gameData.state}`);
        console.log(`Game: componentDidUpdate: prevConnState=${prevState.connectionState} newConnState=${this.state.connectionState}`);

        if ((! this.state.gameData[this.state.playerPosn].enteredGame) && (!this.sentEnterGame)) {
            console.log(`componentDidUpdate: sending enterGame`);
            this.sentEnterGame = true;
            this.sendEnterGame();
        } else if ((this.state.gameData.state === GameStates.INIT_STREAM) &&
            (prevState.gameData.state != GameStates.INIT_STREAM)) {
            console.log(`componentDidUpdate: setting connectionState to initStream`);
            this.setState({ connectionState: 'initStream' });
        } else if (this.state.connectionState === 'initialize') {
            // The Cam object will see the initStream state and initialize the stream.
            console.log(`componentDidUpdate: setting connectionState to initStream`);
            this.setState({ connectionState: 'initStream' } );
        } else if (this.state.connectionState === 'initStream') {
            // The Cam object will see the initStream state and initialize the stream.
            console.log(`componentDidUpdate: setting connectionState to waitForStream`);
            this.setState({ connectionState: 'waitForStream' } );
        } else if ((this.state.connectionState === 'streamIsReady') &&
            (this.state.gameData.state >= GameStates.INIT_STREAM) &&
            !this.sentStreamInitialized) {
            console.log(`componentDidUpdate: sending streamInitialized`);
            this.sentStreamInitialized = true;
            this.sendStreamInitialized();
            console.log(`componentDidUpdate: calling streamIsReady for each camConn`);
            this.camConnMap.forEach( (camConn) => {
                camConn.streamIsReady(this.state.streams[this.posns.bottomPlayerPosn]);
            });
            console.log(`componentDidUpdate: setting connectionState to initConn`);
            this.setState( { connectionState: 'initConn' } );
        } else if ((this.state.connectionState === 'initConn') &&
            (this.state.gameData.state >= GameStates.INIT_CONN) &&
             !this.sentCamOffers) {
            console.log(`componentDidUpdate: sending cam offers`);
            this.sentCamOffers = true;
            this.sendCamOffers();
            console.log(`componentDidUpdate: setting connectionState to negotiating`);
            this.setState( {connectionState: 'negotiating'} );
        } else if ((this.state.connectionState === 'sendConnectionsInitialized') && !this.sentConnectionsInitialized) {
            console.log(`componentDidUpdate: sending connectionsInitialized`);
            this.sentConnectionsInitialized = true;
            this.sendConnectionsInitialized();
            console.log(`componentDidUpdate: setting connectionState to connectionsInitialized`);
            this.setState({ connectionState: 'connectionsInitialized'});
        }
    }


    //handleWindowResize = () => {
    //    console.log(`handleWindowResize: window size = ${window.innerWidth} x ${window.innerHeight}`);
    //}

    initSocketIo = async () => {
        try {
            this.socket = await socketIOClient('/game', {
                transports: ['websocket'],
                query: {
                    sessionId: this.context.session.id,
                }
            });
            this.socket.on('disconnect', this.handleSocketDisconnect);
            this.socket.on(`message`, this.rcvSocketMsg);
        } catch(error) {
            console.log(`Game: Error initializing socket IO: ${error.message}`);
        }
    }

    handleSocketDisconnect = () => {
        console.log(`ConnectionTest: handleSocketDisconnect: Game socket disconnected`);
    }

    rcvSocketMsg = (message) => {
        //console.log(`Received message: ${JSON.stringify(message)}`);
        if (message.source === 'camera') {
            if (message.msgId === 'camConnClosed') {
                this.handleRcvdCamConnClosed(message);
            } else {
                let camConn = this.camConnMap.get(message.fromPlayerPosn);
                camConn.handleMsg(message);
            }
        } else {
            if (message.status === "SUCCESS") {
                switch (message.msgId) {
                    case "gameDataChanged": {
                        this.rcvdGameDataChangedMsg(message);
                        break;
                    }
                    default: {
                        console.log(`Game: Received invalid msgId on Game socket: ${message.msgId}`);
                    }
                }
            } else {
                console.log(`Game: Game socket error: ${message.errorMsg}`);
            }
        }
    }

    sendSocketMsg = async (message) => {
        try {
            message.fromPlayerPosn = this.state.playerPosn;
            this.socket.emit(`message`, message);
        } catch (error) {
            console.log(`Error sending socket msg: ${error.message}`);
        }
    }

    initCameraConnections = (sessionId) => {
        this.initCamConn(sessionId,"topCamConn", this.posns.topPlayerPosn);
        this.initCamConn(sessionId,"leftCamConn", this.posns.leftPlayerPosn);
        this.initCamConn(sessionId,"rightCamConn", this.posns.rightPlayerPosn);
        this.determineCamOffers();
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
        console.log("Game: Received gameDataChanged message");
        console.log(`Game: New game state is ${message.msg.gameData.stateText}`);
        let newState = {
            ...this.state,
            gameData: message.msg.gameData,
        };
        this.setState(newState);
    }

    handleCamConnConnected = async (name) => {
        console.log(`Game: handleCamConnConnected from ${name}`);
        let gameData = this.state.gameData;
        if (this.state.connectionState === 'negotiating') {
            if (this.camConnMap && (this.camConnMap.size === 3)) {
                let allConnected = true;
                this.camConnMap.forEach( (camConn) => {
                    allConnected = allConnected && camConn.connected;
                });

                if (allConnected) {
                    this.setState( { connectionState: 'sendConnectionsInitialized' });
                }
            }
        }
    }

    determineCamOffers = () => {
        switch (this.state.playerPosn) {
            case "player1": {
                // Nothing to do, just wait for offers.
                break;
            }
            case "player2": {
                // Send offer to player 1.
                let camConn = this.camConnMap.get("player1");
                camConn.needsOffer = true;
                break;
            }
            case "player3": {
                // Send offers to player 1 and player 2.
                let camConn = this.camConnMap.get("player1");
                camConn.needsOffer = true;
                camConn = this.camConnMap.get("player2");
                camConn.needsOffer = true;
                break;
            }
            case "player4": {
                // Send offers to player 1, player 2 and player 3.
                let camConn = this.camConnMap.get("player1");
                camConn.needsOffer = true;
                camConn = this.camConnMap.get("player2");
                camConn.needsOffer = true;
                camConn = this.camConnMap.get("player3");
                camConn.needsOffer = true;
                break;
            }
            default: {
                // Nothing to do, just wait for offers.
                break;
            }
        }
    }

    sendCamOffers = () => {
        this.camConnMap.forEach( (camConn) => {
            if (camConn.needsOffer) {
                camConn.createAndSendOffer();
            }
        });
    }

    handleStreamIsReady = (mediaStream) => {
        console.log(`Game::handleStreamIsReady for stream ${mediaStream.id}`);
        let newState = { ...this.state };
        newState.connectionState = 'streamIsReady';
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

    handleReconnect = async (posn) => {
        console.log(`Game::handleReconnect`);

        this.sentConnectionsInitialized = false;
        this.sentCamOffers = false;

        let camConn = this.camConnMap.get(posn);
        let camConnName = camConn.name;
        camConn.close();
        await camConn.sendClose();

        this.initCamConn(this.props.sessionId, camConnName, posn);
        camConn = this.camConnMap.get(posn);
        camConn.needsOffer = true;
        camConn.streamIsReady(this.state.streams[this.posns.bottomPlayerPosn]);

        let newState = { ...this.state };
        newState.connectionState = 'initConn';
        newState.streams[posn] = null;

        this.setState(newState);
    }

    handleCamReload = async () => {
        console.log(`ConnectionTest::handleCamReload`);

        this.camConnMap.forEach( async (camConn) => {
            camConn.close();
            await camConn.sendClose();
        });

        this.initCameraConnections(this.context.session.id);

        this.sentStreamInitialized = false;
        this.sentConnectionsInitialized = false;
        this.sentCamOffers = false;

        this.camConnMap.forEach( async (camConn) => {
            camConn.needsOffer = true;
        });

        this.setState( {
            connectionState: 'initStream',
            streams: {
                player1: null,
                player2: null,
            }
        });
    }

    handleExit = () => {
        this.sendExitGame();
        this.props.onExit(this.state.gameData, this.state.playerPosn);
    }

    handleRcvdCamConnClosed = (message) => {
        let posn = message.fromPlayerPosn;
        console.log(`handleRcvdCamConnClosed from ${posn}`);
        let camConn = this.camConnMap.get(posn);
        let camConnName = camConn.name;
        camConn.close();

        this.initCamConn(this.props.sessionId, camConnName, posn);
        camConn = this.camConnMap.get(posn);
        camConn.streamIsReady(this.state.streams[this.posns.bottomPlayerPosn]);

        let newState = { ...this.state };
        newState.connectionState = 'negotiating';
        newState.streams[posn] = null;
        this.setState(newState);
    }

    sendExitGame = async () => {
        let socketMsg = new SocketMsg(this.context.session.id);
        socketMsg.msgId = 'exitGame';
        this.sendSocketMsg(socketMsg);
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
            let playerPosn = this.context.session.currentGame.playerPosn;
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
        let playerPosn = this.context.session.currentGame.playerPosn;
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
        let imgSrc = CommonCards.cardBack;
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
        let imgSrc = CommonCards.cardBackHoriz;
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

    getPlayerCardCmpnts = (cards, gameData) => {
        let playerCardCmpnts = [];
        let wrapperClass = "bottomPlayerCardWrapper";
        let buttonClass = "bottomPlayerCardButton";
        let imgClass = "bottomPlayerCard";

        cards.forEach( (card, index) => {
            let cardId = card.id;
            if (cardId === 'cardElemental') {
                if (gameData.trumpSuit && (gameData.trumpSuit.length > 0)) {
                    cardId = 'card' + gameData.trumpSuit + 'Elemental';
                }
            }
            let imgSrc = this.cardDeck[cardId];
            let key = card.id + index;
            let wrapperKey = "wrapper" + key;
            let cardKey = "card" + key;
            playerCardCmpnts.push(
                <div key={wrapperKey} className={wrapperClass}>
                    <PlayerCard
                        cardKey={cardKey}
                        cardId={card.id}
                        buttonClass={buttonClass}
                        onClick={this.handleCardClick}
                        imgClass={imgClass}
                        imgSrc={imgSrc} />
                </div>
            );
        });

        return playerCardCmpnts;
    }


    render() {
        console.log("Game: render");
        let gameData = this.state.gameData;

        let topPlayer = gameData[this.posns.topPlayerPosn];
        let leftPlayer = gameData[this.posns.leftPlayerPosn];
        let rightPlayer = gameData[this.posns.rightPlayerPosn];
        let bottomPlayer = gameData[this.posns.bottomPlayerPosn];

        let playerCardCmpnts = this.getPlayerCardCmpnts(bottomPlayer.cards, gameData);

        let topCam =
            <RemoteCam
                name="topCam"
                mediaStream={this.state.streams[this.posns.topPlayerPosn]}
                audioDst={this.context.mediaSettings.audioDst}
            />;

        let leftCam =
            <RemoteCam
                name="leftCam"
                mediaStream={this.state.streams[this.posns.leftPlayerPosn]}
                audioDst={this.context.mediaSettings.audioDst}
        />;

        let rightCam =
            <RemoteCam
                name="rightCam"
                mediaStream={this.state.streams[this.posns.rightPlayerPosn]}
                audioDst={this.context.mediaSettings.audioDst}
        />;

        let bottomCam =
            <Cam
                name="bottomCam"
                initStream={this.state.connectionState === 'initStream'}
                mediaStream={this.state.streams[this.posns.bottomPlayerPosn]}
                onStreamReady={this.handleStreamIsReady}
                gameDataState={this.state.gameData.state}
                videoSrc={this.context.mediaSettings.videoSrc}
                audioSrc={this.context.mediaSettings.audioSrc}
                audioDst=""
            />;


        return (
            <div className="gameView">
                <div className="gameArea">
                    <GameInfoArea
                        gameData={this.state.gameData}
                        onRefresh={this.handleGetGameData}
                        onReloadCam={this.handleCamReload}
                        onExit={this.handleExit}
                    />
                    <div className="topPlayerArea">
                        {topCam}
                        <MyButton
                            btnClass="gameReconnectBtn"
                            btnText="Reconnect"
                            onClick={this.handleReconnect}
                            onClickValue={this.posns.topPlayerPosn}>
                        </MyButton>
                    </div>
                    {/*}
                    <div className="gameHelpArea">
                        <span className="gameHelpText">Hover over card to expand</span>
                        <span className="gameHelpText">Click card to play</span>
                    </div>
                    {*/}
                    <div className="leftPlayerArea">
                        {leftCam}
                        <MyButton
                            btnClass="gameReconnectBtn"
                            btnText="Reconnect"
                            onClick={this.handleReconnect}
                            onClickValue={this.posns.leftPlayerPosn}>
                        </MyButton>
                    </div>
                    <CardTable
                        gameData={this.state.gameData}
                        playerPosns={this.posns}
                        onPlayerAction={this.handlePlayerAction}
                        onKittyCardClick={this.handleKittyCardClick}
                        onKittyDone={this.handleKittyDone}>
                    </CardTable>
                    <div className="rightPlayerArea">
                        <MyButton
                            btnClass="gameReconnectBtn"
                            btnText="Reconnect"
                            onClick={this.handleReconnect}
                            onClickValue={this.posns.rightPlayerPosn}>
                        </MyButton>
                        {rightCam}
                    </div>
                    <div className="bottomPlayerArea">
                        {bottomCam}
                        <div className="bottomPlayerCardArea">
                            {playerCardCmpnts}
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        );
    }
}

Game.contextType = AppContext;

export default Game;
