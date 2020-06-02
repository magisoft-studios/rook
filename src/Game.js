import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cards from './Cards'
import players from './Players'
import GameInfoArea from './GameInfoArea';
import Card from './Card';
import PlayerHand from './PlayerHand';
import OpponentCard from './OpponentCard';
import CardTable from './CardTable';
import {AppContext} from './ContextLib';
import PlayerStates from './PlayerStates';
import GameStates from './GameStates';
import PlayerActions from './PlayerActions';
import Cam from './Cam.js';
import RemoteCam from './RemoteCam.js';
import CamConn from './CamConn.js';
import socketIOClient from 'socket.io-client';

const REFRESH_RATE = 5000;

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
            streams: {
                player1: null,
                player2: null,
                player3: null,
                player4: null,
            },
        }
        this.calcPlayerPosns(props.playerPosn);
        this.updateTimerId = null;
        this.socket = null;
        this.camConnMap = new Map();
        this.initCameraConnections();
    }

    componentDidMount = async () => {
        await this.checkStatus();
        this.initSocketIo();
        this.updateTimerId = setInterval(async () => this.checkStatus(), REFRESH_RATE);
    }

    componentWillUnmount() {
        clearInterval(this.updateTimerId);
    }

    initSocketIo = async () => {
        try {
            //this.socket = socketIOClient(window.location.href);
            this.socket = await socketIOClient('/game', {
                query: {
                    sessionId: this.context.id,
                }
            });
            this.socket.on(`message`, this.rcvSocketMsg);
        } catch(error) {
            console.log(`Error initializing socket IO: ${error.message}`);
        }
    }

    rcvSocketMsg = (message) => {
        //console.log(`Received message: ${JSON.stringify(message)}`);
        if (message.source = "camera") {
            let camConn = this.camConnMap.get(message.fromPlayerPosn);
            camConn.handleMsg(message);
        } else {
            console.log("Received a socket message not from a camera");
        }
    }

    sendSocketMsg = async (message) => {
        try {
            let socketMsg = {
                sessionId: this.context.id,
                fromPlayerPosn: this.state.playerPosn,
                ...message,
            }
            this.socket.emit(`message`, socketMsg);
        } catch (error) {
            console.log(`Error sending socket msg: ${error.message}`);
        }
    }

    checkStatus = async () => {
        await this.getGameData();
        this.checkConnectionStates();
    }

    initCameraConnections = () => {
        this.initCamConn("topCamConn", this.posns.topPlayerPosn);
        this.initCamConn("leftCamConn", this.posns.leftPlayerPosn);
        this.initCamConn("rightCamConn", this.posns.rightPlayerPosn);
    }

    initCamConn = (name, posn) => {
        let camConn = new CamConn({
            name: name,
            playerPosn: this.state.playerPosn,
            peerPosn: posn,
            gameData: this.state.gameData,
            sendMessage: this.sendSocketMsg,
            handleAddStream: this.handleAddStream,
        });
        this.camConnMap.set(posn, camConn);
    }

    checkConnectionStates = async () => {
        let gameData = this.state.gameData;
        if (gameData.state === GameStates.INIT_STREAM) {
            if (this.camConnMap && (this.camConnMap.size == 3)) {
                if (this.state.streams[this.posns.bottomPlayerPosn] != null) {
                    let requestOptions = this.setupRequestOptions();
                    await this.sendRequest("streamInitialized", requestOptions);
                }
            }
        } else if (gameData.state === GameStates.INIT_CONN) {
            if (this.camConnMap && (this.camConnMap.size == 3)) {
                let allConnected = true;
                this.camConnMap.forEach( (camConn) => {
                    allConnected = allConnected && camConn.connected;
                });

                if (!allConnected) {
                    this.sendCamOffers();
                } else {
                    let requestOptions = this.setupRequestOptions();
                    await this.sendRequest("connectionsInitialized", requestOptions);
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

    setupRequestOptions = (bodyProps) => {
        return {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: this.context.id,
                ...bodyProps,
            }),
        };
    }

    sendRequest = async (cmd, options) => {
        try {
            let url = "/rook/" + cmd;
            const response = await fetch(url, options);
            if (!response.ok) {
                throw Error(response.statusText);
            } else {
                const jsonResp = await response.json();
                let status = jsonResp.rookResponse.status;
                if (status === "SUCCESS") {
                    this.setState({
                        ...this.state,
                        gameData: jsonResp.rookResponse.gameData
                    });
                } else {
                    alert(jsonResp.rookResponse.errorMsg);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    getGameData = async () => {
        let requestOptions = this.setupRequestOptions();
        await this.sendRequest("getGameData", requestOptions);
    }

    handlePlayerAction = async (params) => {
        let requestOptions = this.setupRequestOptions({
            action: params.action,
            value: params.value ? params.value : "NA",
        });
        await this.sendRequest("playerAction", requestOptions);
    }

    handleKittyCardClick = async (cardId) => {
        if (this.state.gameData.state === GameStates.POPULATE_KITTY) {
            let requestOptions = this.setupRequestOptions({cardId: cardId});
            await this.sendRequest("takeKittyCard", requestOptions);
        }
    }

    handleCardClick = async (cardId) => {
        let requestOptions = this.setupRequestOptions({cardId: cardId});

        if (this.state.gameData.state === GameStates.POPULATE_KITTY) {
            this.sendRequest("putKittyCard", requestOptions);
        } else if (this.state.gameData.state === GameStates.WAIT_FOR_CARD) {
            let gameData = this.state.gameData;
            let playerPosn = this.context.currentGame.playerPosn;
            let player = gameData[playerPosn];
            if (gameData[playerPosn].state === PlayerStates.PLAY_CARD) {
                if (this.isValidPlay(player, cardId, gameData.trick.suit)) {
                    await this.sendRequest("playCard", requestOptions);
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
                    let requestOptions = this.setupRequestOptions({
                        action: PlayerActions.KITTY_DONE,
                        value: "NA",
                    });
                    await this.sendRequest("playerAction", requestOptions);
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
        if (trickSuit.length == 0) {
            isValid = true;
        } else {
            if (card.suit === trickSuit) {
                isValid = true;
            } else {
                // Check if player has any cards of that suit.
                let cardOfTrickSuit = player.cards.find((card) => {
                    return (card.suit == trickSuit);
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


    // NOTE: There is currently no way to prevent an "empty" render before the first data fetch
    //
    render() {
        console.log("Game: render START");
        let gameData = this.state.gameData;

        let topPlayer = gameData[this.posns.topPlayerPosn];
        let leftPlayer = gameData[this.posns.leftPlayerPosn];
        let rightPlayer = gameData[this.posns.rightPlayerPosn];
        let bottomPlayer = gameData[this.posns.bottomPlayerPosn];

        let topPlayerImg = topPlayer.imgName;
        let leftPlayerImg = leftPlayer.imgName;
        let rightPlayerImg = rightPlayer.imgName;
        let bottomPlayerImg = bottomPlayer.imgName;

        let topPlayerImgClass = "playerImage";
        let leftPlayerImgClass = "playerImage";
        let rightPlayerImgClass = "playerImage";
        let bottomPlayerImgClass = this.getImageClass(bottomPlayer);

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
                //bottomPlayerCards.push(new Card("card14Yellow", "card14Yellow", 14, 10, "yellow"));
            }
        }

        let topCam = <RemoteCam name="topCam" mediaStream={this.state.streams[this.posns.topPlayerPosn]} />;
        let leftCam = <RemoteCam name="leftCam" mediaStream={this.state.streams[this.posns.leftPlayerPosn]} />;
        let rightCam = <RemoteCam name="rightCam" mediaStream={this.state.streams[this.posns.rightPlayerPosn]} />;
        let bottomCam = <Cam name="bottomCam" mediaStream={this.state.streams[this.posns.bottomPlayerPosn]} onStreamReady={this.handleStreamIsReady} />;


        return (
            <div className="gameView">
                <div className="gameArea">
                    <GameInfoArea gameData={this.state.gameData} socketHndl={this.sendSocketMsg} />
                    <div className="topPlayerArea">
                        {topCam}
                        <div className="topPlayerCardArea">
                            {topPlayerCardCmpnts}
                        </div>
                    </div>
                    <div className="leftPlayerArea">
                        {leftCam}
                        <div className="leftPlayerCardArea">
                            {leftPlayerCardCmpnts}
                        </div>
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
                        <div className="rightPlayerCardArea">
                            {rightPlayerCardCmpnts}
                        </div>
                    </div>
                    <div className="bottomPlayerArea">
                        {bottomCam}
                        <div className="bottomPlayerCardArea">
                            <PlayerHand
                                ref={this.playerHandRef}
                                cardList={bottomPlayerCards}
                                onClick={this.handleCardClick} />
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        );
    }
}

/*
  <img className={bottomPlayerImgClass} src={players[bottomPlayerImg]} alt="Player 4"></img>
 */

Game.contextType = AppContext;

export default Game;
