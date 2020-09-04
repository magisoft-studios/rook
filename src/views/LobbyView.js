import React, { Component } from "react";
import NewGameDialog from '../NewGameDialog';
import GameSetupDialog from '../GameSetupDialog';
import ConnectionTestSetupDialog from '../ConnectionTestSetupDialog';
import AppContext from '../ContextLib';
import MyButton from "../MyButton";
import socketIOClient from "socket.io-client";
import SocketMsg from '../SocketMsg';
import CamCfg from '../CamCfg';
import '../css/LobbyView.scss';
import LobbyGameData from '../data/LobbyGameData';
import SessionTimeoutDlg from '../SessionTimeoutDlg';

const SESSION_TIMEOUT = 900000;     // 15 minutes until timeout warning.

class LobbyView extends Component {
    constructor(props) {
        super(props);
        console.log("Constructing LobbyView");
        this.state = {
            showNewGameDialog: false,
            showGameSetupDialog: false,
            showAvailableGames: true,
            availableGames: [],
            hasJoinedGame: false,
            hasJoinedTeam: false,
            playerPosn: "",
            currentGameData: null,
            sessionTimingOut: false,
            sessionTimedOut: false,
        };
        this.sessionTimer = null;
    }

    async componentDidMount() {
        await this.initSocketIo();
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }
        this.sessionTimer = setTimeout(this.handleSessionTimingOut, SESSION_TIMEOUT);
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");
        if (this.socket) {
            this.socket.disconnect();
        }
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.sessionTimedOut) {
            clearTimeout(this.sessionTimer);
            this.props.onSessionTimeout();
            this.setState({
                sessionTimedOut: false
            });
        }
    }

    initSocketIo = async () => {
        try {
            this.socket = await socketIOClient('/lobby', {
                transports: ['websocket'],
                query: {
                    sessionId: this.context.session.id,
                }
            });
            this.socket.on('disconnect', () => {
                console.log(`Disconnected from Lobby socket`);
            });
            this.socket.on(`message`, this.rcvdSocketMsg);
        } catch(error) {
            console.log(`Error initializing Lobby socket IO: ${error.message}`);
        }
    }

    handleSessionTimingOut = () => {
        console.log("LobbyView:handleSessionTimingOut");
        this.setState({
            sessionTimingOut: true,
        });
    }

    handleSessionTimedOut = async () => {
        console.log("LobbyView:handleSessionTimedOut");
        this.setState({
            sessionTimingOut: false,
            sessionTimedOut: true,
        });
    }

    handleContinueSession = () => {
        console.log("LobbyView:handleContinueSession");
        this.getAvailGames();
        this.setState({
            sessionTimingOut: false,
            sessionTimedOut: false,
        });
    }


    //
    // RECEIVED MESSAGES
    //

    rcvdSocketMsg = (message) => {
        console.log(`Received message: ${JSON.stringify(message)}`);
        if (message.status === "SUCCESS") {
            switch (message.msgId) {
                case "availGames": {
                    this.rcvdAvailGamesMsg(message);
                    break;
                }
                case "newGame": {
                    this.rcvdNewGameMsg(message);
                    break;
                }
                case "joinedGame": {
                    this.rcvdJoinedGameMsg(message);
                    break;
                }
                case "leftGame": {
                    this.rcvdLeftGameMsg(message);
                    break;
                }
                case "joinedTeam": {
                    this.rcvdJoinedTeamMsg(message);
                    break;
                }
                case "gameDataChanged": {
                    this.rcvdGameDataChangedMsg(message);
                    break;
                }
                case "enterGame": {
                    this.rcvdEnterGameMsg(message);
                    break;
                }
                default: {
                    console.log(`Received invalid msgId on Lobby socket: ${message.msgId}`);
                    break;
                }
            }
        } else {
            alert(`Error: ${message.errorMsg}`);
        }
    }

    rcvdAvailGamesMsg(message) {
        if (this.state.showAvailableGames) {
            this.setState({
                ...this.state,
                availableGames: message.msg.availGames,
            });
        }
    }

    rcvdNewGameMsg(message) {
        console.log(`LobbyView:rcvdNewGameMsg: calling fromJson`);
        let lobbyGameData = LobbyGameData.fromJson(message.msg.gameData);
        console.log(`LobbyView:rcvdNewGameMsg: back from fromJson`);

        this.setState({
            showNewGameDialog: false,
            showGameSetupDialog: true,
            showAvailableGames: false,
            availableGames: [],
            hasJoinedGame: true,
            hasJoinedTeam: true,
            playerPosn: "player1",
            currentGameData: lobbyGameData,
        });
    }

    rcvdJoinedGameMsg(message) {
        let lobbyGameData = LobbyGameData.fromJson(message.msg.gameData);
        this.setState({
            ...this.state,
            showAvailableGames: false,
            availableGames: [],
            showGameSetupDialog: true,
            hasJoinedGame: true,
            hasJoinedTeam: false,
            currentGameData: lobbyGameData,
        })
    }

    rcvdLeftGameMsg(message) {
        this.setState({
            ...this.state,
            showNewGameDialog: false,
            showGameSetupDialog: false,
            showAvailableGames: true,
            hasJoinedGame: false,
            hasJoinedTeam: false,
            playerPosn: null,
            currentGameData: null,
            availableGames: message.msg.availGames,
        });
    }

    rcvdJoinedTeamMsg(message) {
        let lobbyGameData = LobbyGameData.fromJson(message.msg.gameData);
        this.setState({
            showNewGameDialog: false,
            showGameSetupDialog: true,
            showAvailableGames: false,
            availableGames: [],
            hasJoinedGame: true,
            hasJoinedTeam: true,
            playerPosn: message.msg.playerPosn,
            currentGameData: lobbyGameData,
        });
    }

    rcvdGameDataChangedMsg(message) {
        let lobbyGameData = LobbyGameData.fromJson(message.msg.gameData);
        this.setState({
            ...this.state,
            showAvailableGames: false,
            availableGames: [],
            showGameSetupDialog: true,
            currentGameData: lobbyGameData,
        })
    }

    rcvdEnterGameMsg(message) {
        let runningGameData = message.msg.gameData;

        this.setState({
            ...this.state,
            showNewGameDialog: false,
            showGameSetupDialog: false,
            showAvailableGames: false,
        });

        this.props.onEnterGame(runningGameData, this.state.playerPosn);
    }


    //
    // SEND MESSAGES
    //

    sendSocketMsg = async (socketMsg) => {
        try {
            console.log(`Sending message: ${JSON.stringify(socketMsg)}`);
            await this.socket.emit(`message`, socketMsg);
        } catch (error) {
            console.log(`Error sending socket msg: ${error.message}`);
        }
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }
        this.sessionTimer = setTimeout(this.handleSessionTimingOut, SESSION_TIMEOUT);
    }

    getAvailGames = async () => {
        let socketMsg = new SocketMsg(this.context.session.id);
        socketMsg.msgId = 'getAvailGames';
        this.sendSocketMsg(socketMsg);
    }

    handleCreateNewGame = () => {
        this.setState({
            ...this.state,
            showNewGameDialog: true,
            showGameSetupDialog: false,
            showAvailableGames: false,
        });
        this.requestInProgress = false;
    }

    handleNewGameOk = async (gameName, gameType, invitees) => {
        let socketMsg = new SocketMsg(this.context.session.id);
        socketMsg.msgId = 'newGame';
        socketMsg.msg = {
            gameName: gameName,
            gameType: gameType,
            invitees: invitees,
        };
        this.sendSocketMsg(socketMsg);
    }

    handleNewGameCancel = (event) => {
        this.setState({
            ...this.state,
            showNewGameDialog: false,
            showGameSetupDialog: false,
            showAvailableGames: true,
        });
    }

    handleJoinGame = async (gameName) => {
        let socketMsg = new SocketMsg(this.context.session.id);
        socketMsg.msgId = 'joinGame';
        socketMsg.msg = {
            gameName: gameName,
        };
        this.sendSocketMsg(socketMsg);
    }

    handleLeaveGame = async (gameName) => {
        let socketMsg = new SocketMsg(this.context.session.id);
        socketMsg.msgId = 'leaveGame';
        socketMsg.msg = {
            gameName: gameName,
            playerPosn: this.state.playerPosn,
        };
        this.sendSocketMsg(socketMsg);
    }

    handleJoinTeam = async (gameName, playerPosn) => {
        let socketMsg = new SocketMsg(this.context.session.id);
        socketMsg.msgId = 'joinTeam';
        socketMsg.msg = {
            gameName: gameName,
            playerId: this.context.session.playerId,
            playerPosn: playerPosn,
        };
        this.sendSocketMsg(socketMsg);
    }

    handleEnterGame = async (gameName) => {
        let socketMsg = new SocketMsg(this.context.session.id);
        socketMsg.msgId = 'enterGame';
        socketMsg.msg = {
            gameName: gameName
        };
        this.sendSocketMsg(socketMsg);
    }



    render() {
        console.log(`LobbyView:render`);

        let sessionTimeoutDlg = null;
        if (this.state.sessionTimingOut) {
            sessionTimeoutDlg =
                <div className="lobbyViewSessionTimeoutDiv">
                    <SessionTimeoutDlg
                        onContinue={this.handleContinueSession}
                        onTimedOut={this.handleSessionTimedOut}/>
                </div>;
        }

        let availableGameTable = null;
        if (this.state.showAvailableGames && this.state.availableGames) {
            let availGameCmpnts = [];
            if (this.state.availableGames.length > 0) {
                this.state.availableGames.forEach((game, index) => {
                    availGameCmpnts.push(
                        <tr key={game.userGameName}>
                            <td>{game.userGameName}</td>
                            <td>{game.descName}</td>
                            <td>
                                <MyButton
                                    btnClass="lobbyJoinGameBtn"
                                    btnText="View Game"
                                    onClick={this.handleJoinGame}
                                    onClickValue={game.userGameName}>
                                </MyButton>
                            </td>
                        </tr>
                    )
                });

                availableGameTable = (
                    <table className="availGamesTable">
                        <thead>
                        <tr>
                            <th>Game Name</th>
                            <th>Game Type</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {availGameCmpnts}
                        </tbody>
                    </table>
                );
            }
        }

        let newGameDlg = null;
        if (this.state.showNewGameDialog) {
            newGameDlg =
                <NewGameDialog
                    friends={this.context.session.friends}
                    onOk={this.handleNewGameOk}
                    onCancel={this.handleNewGameCancel} />
        }

        let gameSetupDlg = null;
        if (this.state.showGameSetupDialog) {
            let lobbyGameData = this.state.currentGameData;
            console.log(`render:lobbyGameData = ${JSON.stringify(lobbyGameData)}`);
            if ((lobbyGameData.desc.name === "Rook") || (lobbyGameData.desc.name === "Elements")) {
                console.log(`render: creating gameSetupDlg for Elements`);
                let player1 = lobbyGameData.players.get('player1');
                let player2 = lobbyGameData.players.get('player2');
                let player3 = lobbyGameData.players.get('player3');
                let player4 = lobbyGameData.players.get('player4');
                gameSetupDlg =
                    <GameSetupDialog
                        hasJoinedTeam={this.state.hasJoinedTeam}
                        enableEnterGameBtn={lobbyGameData.readyToStart}
                        gameName={lobbyGameData.name}
                        gameType={lobbyGameData.desc.name}
                        player1={(player1 != null) ? player1.name : ""}
                        player2={(player2 != null) ? player2.name : ""}
                        player3={(player3 != null) ? player3.name : ""}
                        player4={(player4 != null) ? player4.name : ""}
                        onJoinTeam={this.handleJoinTeam}
                        onEnterGame={this.handleEnterGame}
                        onLeaveGame={this.handleLeaveGame}/>
            } else if (lobbyGameData.desc.name === "ConnectionTest") {
                let player1 = lobbyGameData.players.get('player1');
                let player2 = lobbyGameData.players.get('player2');
                gameSetupDlg =
                    <ConnectionTestSetupDialog
                        hasJoinedTeam={this.state.hasJoinedTeam}
                        enableEnterGameBtn={lobbyGameData.readyToStart}
                        gameName={lobbyGameData.name}
                        gameType={lobbyGameData.desc.name}
                        player1Name={(player1 != null) ? player1.name : ""}
                        player2Name={(player2 != null) ? player2.name : ""}
                        onEnterGame={this.handleEnterGame}
                        onLeaveGame={this.handleLeaveGame}/>
            }
        }

        let newGameBtn = null;
        if (!this.state.hasJoinedGame && this.state.showAvailableGames && this.context.session.permissions.createGame) {
            newGameBtn =
                <MyButton
                    btnClass="lobbyNewGameBtn"
                    btnText="Create New Game"
                    onClick={this.handleCreateNewGame}>
                </MyButton>
        }

        return (
            <div className="lobbyView">
                <div className="lobbyWelcomeDiv">
                    <span className="lobbyWelcomeMsg">Welcome to the Game Lobby</span>
                </div>
                <div className="lobbyItemsArea">
                    <CamCfg cookies={this.props.cookies} />
                    <div className="lobbyGamesArea">
                        <div className="lobbyGamesTitleArea">
                            <div className="lobbyGamesTitle"><span>Available Games</span></div>
                        </div>
                        {availableGameTable}
                        <div className="lobbyViewCtrlPnlDiv">
                            {newGameBtn}
                        </div>
                        {newGameDlg}
                        {gameSetupDlg}
                    </div>
                </div>
                {sessionTimeoutDlg}
            </div>
        );
    }
}

LobbyView.contextType = AppContext;

export default LobbyView;