import React, { Component } from 'react'
import {AppContext} from './ContextLib';
import GameStates from './GameStates';
import Cam from './Cam.js';
import RemoteCam from './RemoteCam.js';
import CamConn from './CamConn.js';
import socketIOClient from 'socket.io-client';
import SocketMsg from "./SocketMsg";
import './css/ConnectionTest.scss';
import MyButton from './MyButton';

class ConnectionTest extends Component {
    constructor(props) {
        super(props);
        this.playerHandRef = React.createRef();
        this.cardTableRef = React.createRef();
        this.posns = {
            bottomPlayerPosn: "",
            topPlayerPosn: "",
        };
        this.state = {
            gameId: props.gameId,
            playerPosn: props.playerPosn,
            gameData: props.gameData,
            initStream: false,
            streams: {
                player1: null,
                player2: null,
            },
        }
        this.calcPlayerPosns(props.playerPosn);
        this.socket = null;
        this.camConnMap = new Map();
        this.initCameraConnections(props.sessionId);
        this.sentStreamInitialized = false;
    }

    componentDidMount = async () => {
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

    initSocketIo = async () => {
        try {
            this.socket = await socketIOClient('/game', {
                transports: ['websocket'],
                query: {
                    sessionId: this.context.id,
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
        console.log(`Received message: ${JSON.stringify(message)}`);
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
            if (this.camConnMap && (this.camConnMap.size === 2)) {
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

    handleReinit = () => {
        console.log(`Game::handleReinit`);
        this.sentStreamInitialized = true;
        this.camConnMap.clear();
        this.initCamConn(this.props.sessionId,"topCamConn", this.posns.topPlayerPosn);
        this.setState( {
            initStream: true,
            streams: {
                player1: null,
                player2: null,
            }
         });
    }

    sendEnterGame = async () => {
        let socketMsg = new SocketMsg(this.context.id);
        socketMsg.msgId = 'enterGame';
        this.sendSocketMsg(socketMsg);
    }

    sendStreamInitialized = async () => {
        let socketMsg = new SocketMsg(this.context.id);
        socketMsg.msgId = 'streamInitialized';
        this.sendSocketMsg(socketMsg);
    }

    sendConnectionsInitialized = async () => {
        let socketMsg = new SocketMsg(this.context.id);
        socketMsg.msgId = 'connectionsInitialized';
        this.sendSocketMsg(socketMsg);
    }

    calcPlayerPosns(playerPosn) {
        switch (playerPosn) {
            case "player1":
                this.posns.bottomPlayerPosn = "player1";
                this.posns.topPlayerPosn = "player2";
                break;
            case "player2":
                this.posns.bottomPlayerPosn = "player2";
                this.posns.topPlayerPosn = "player1";
                break;
            default:
                this.posns.bottomPlayerPosn = "player1";
                this.posns.topPlayerPosn = "player2";
                break;
        }
    }


    render() {
        console.log(`ConnectionTest: render: `);
        let topCam =
            <RemoteCam
                name="topCam"
                mediaStream={this.state.streams[this.posns.topPlayerPosn]} />;

        let bottomCam = <Cam
            name="bottomCam"
            initStream={this.state.initStream}
            mediaStream={this.state.streams[this.posns.bottomPlayerPosn]}
            onStreamReady={this.handleStreamIsReady}
            gameDataState={this.state.gameData.state}/>;


        return (
            <div className="connTestView">
                <div className="connTestTopArea">
                    {topCam}
                </div>
                <div className="connTestCtrlPnlDiv">
                    <MyButton
                        btnClass="connTestReinitBtn"
                        btnText="Re-Initialize"
                        onClick={() => this.handleReinit()}>
                    </MyButton>
                </div>
                <div className="connTestBottomArea">
                    {bottomCam}
                </div>
            </div>
        );
    }
}

ConnectionTest.contextType = AppContext;

export default ConnectionTest;
