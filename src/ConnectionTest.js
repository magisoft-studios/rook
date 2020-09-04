import React, { Component } from 'react'
import AppContext from './ContextLib';
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
        this.posns = {
            bottomPlayerPosn: "",
            topPlayerPosn: "",
        };
        this.state = {
            gameId: props.gameId,
            playerPosn: props.playerPosn,
            gameData: props.gameData,
            connectionState: '',
            streams: {
                player1: null,
                player2: null,
            },
        }
        this.calcPlayerPosns(props.playerPosn);
        this.socket = null;
        this.camConnMap = new Map();
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        window.addEventListener('unload', this.handleUnload);
        this.initCameraConnections(props.sessionId);
        this.sentEnterGame = false;
    }

    componentDidMount = async () => {
        if (this.socket === null) {
            console.log(`ConnectionTest: componentDidMount: initializing socket IO`);
            await this.initSocketIo();
        }
        this.setState( {connectionState: 'initStream'});
    }

    componentWillUnmount() {
        console.log("ConnectionTest: componentWillUnmount");
    }

    handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = "Are you sure you want to exit the game?";
    }

    handleUnload = (event) => {
        console.log("ConnectionTest: handleUnload, sending exit msg, disconnecting socket");
        this.handleExit();
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        window.removeEventListener('unload', this.handleUnload);
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(`componentDidUpdate: prevState=${prevState.gameData.state} newState=${this.state.gameData.state}`);
        console.log(`componentDidUpdate: prevConnState=${prevState.connectionState} newState=${this.state.connectionState}`);

        if (! this.state.gameData[this.state.playerPosn].enteredGame) {
            console.log(`componentDidUpdate: sending enterGame`);
            this.sentEnterGame = true;
            this.sendEnterGame();
        } else if ((this.state.gameData.state.str === 'INIT_STREAM') &&
            (prevState.gameData.state.str !== 'INIT_STREAM')) {
            console.log(`componentDidUpdate: setting connectionState to initStream`);
            this.setState({ connectionState: 'initStream' });
        } else if (this.state.connectionState === 'initStream') {
            // The Cam object will see the initStream state and initialize the stream.
            console.log(`componentDidUpdate: setting connectionState to waitForStream`);
            this.setState({ connectionState: 'waitForStream' } );
        } else if (this.state.connectionState === 'streamIsReady') {
            console.log(`componentDidUpdate: sending streamInitialized`);
            this.sendStreamInitialized();
            console.log(`componentDidUpdate: calling streamIsReady for each camConn`);
            this.camConnMap.forEach( (camConn) => {
                camConn.streamIsReady(this.state.streams[this.posns.bottomPlayerPosn]);
            });
            console.log(`componentDidUpdate: setting connectionState to initConn`);
            this.setState( { connectionState: 'initConn' } );
        } else if (this.state.connectionState === 'initConn') {
            console.log(`componentDidUpdate: sending cam offers`);
            this.sendCamOffers();
            console.log(`componentDidUpdate: setting connectionState to negotiating`);
            this.setState( {connectionState: 'negotiating'} );
        } else if (this.state.connectionState === 'sendConnectionsInitialized') {
            console.log(`componentDidUpdate: sending connectionsInitialized`);
            this.sendConnectionsInitialized();
            console.log(`componentDidUpdate: setting connectionState to connectionsInitialized`);
            this.setState({ connectionState: 'connectionsInitialized'});
        }
   }

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
            console.log(`ConnectionTest: Error initializing socket IO: ${error.message}`);
        }
    }

    handleSocketDisconnect = () => {
        console.log(`ConnectionTest: handleSocketDisconnect: Game socket disconnected`);
    }

    rcvSocketMsg = (message) => {
        console.log(`Received message: ${JSON.stringify(message)}`);
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
                        console.log(`ConnectionTest: Received invalid msgId on Game socket: ${message.msgId}`);
                    }
                }
            } else {
                console.log(`ConnectionTest: Game socket error: ${message.errorMsg}`);
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
        console.log("ConnectionTest: Received gameDataChanged message");
        console.log(`ConnectionTest: New game state is ${message.msg.gameData.stateDisplayText}`);
        let newState = {
            ...this.state,
            gameData: message.msg.gameData,
        };
        this.setState(newState);
    }

    handleCamConnConnected = async (name) => {
        console.log(`ConnectionTest: handleCamConnConnected from ${name}`);
        if (this.state.connectionState === 'negotiating') {
            if (this.camConnMap && (this.camConnMap.size === 1)) {
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
        console.log(`ConnectionTest::handleStreamIsReady for stream ${mediaStream.id}`);
        let newState = { ...this.state };
        newState.connectionState = 'streamIsReady';
        newState.streams[this.posns.bottomPlayerPosn] = mediaStream;
        this.setState(newState);
    }

    handleAddStream = (posn, mediaStream) => {
        console.log(`ConnectionTest::handleAddStream called for ${posn}`);
        let newState = { ...this.state };
        newState.streams[posn] = mediaStream;
        console.log(`ConnectionTest::handleAddStream: adding media stream: ${mediaStream.id}`);
        this.setState(newState);
    }

    handleReinit = async (posn) => {
        console.log(`ConnectionTest::handleReinit`);

        let camConn = this.camConnMap.get(posn);
        let camConnName = camConn.name;
        camConn.close();
        await camConn.sendClose();

        this.sentStreamInitialized = true;
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

        this.sentStreamInitialized = false;
        this.initCameraConnections(this.context.session.id);

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

        this.sentStreamInitialized = true;
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

    calcPlayerPosns = (playerPosn) => {
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
                mediaStream={this.state.streams[this.posns.topPlayerPosn]}
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
            <div className="connTestView">
                <div className="connTestGameDataDiv">
                    <span className="connTestGameStatus">Status: {this.state.gameData.stateDisplayText}</span>
                </div>
                <div className="connTestTopArea">
                    {topCam}
                    <MyButton
                        btnClass="connTestReconnectBtn"
                        btnText="Reconnect"
                        onClick={this.handleReinit}
                        onClickValue={this.posns.topPlayerPosn}>
                    </MyButton>
                </div>
                <div className="connTestBottomArea">
                    {bottomCam}
                    <MyButton
                        btnClass="connTestCamReloadBtn"
                        btnText="Reload Camera"
                        onClick={this.handleCamReload}>
                    </MyButton>
                </div>
                <div className="connTestCtrlPnlDiv">
                    <MyButton
                        btnClass="connTestExitBtn"
                        btnText="Exit Game"
                        onClick={this.handleExit}>
                    </MyButton>
                </div>
            </div>
        );
    }
}

ConnectionTest.contextType = AppContext;

export default ConnectionTest;
