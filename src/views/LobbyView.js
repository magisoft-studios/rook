import React, { Component } from "react";
import NewGameDialog from '../NewGameDialog';
import GameSetupDialog from '../GameSetupDialog';
import ConnectionTestSetupDialog from '../ConnectionTestSetupDialog';
import { AppContext } from '../ContextLib';
import MyButton from "../MyButton";
import socketIOClient from "socket.io-client";
import SocketMsg from '../SocketMsg';
import GameStates from '../GameStates';
import '../css/LobbyView.scss';

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
        };
    }

    async componentDidMount() {
        await this.initSocketIo();
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    initSocketIo = async () => {
        try {
            this.socket = await socketIOClient('/lobby', {
                transports: ['websocket'],
                query: {
                    sessionId: this.context.id,
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
                default: {
                    console.log(`Received invalid msgId on Lobby socket: ${message.msgId}`);
                    break;
                }
            }
        } else {
            console.log(`Lobby socket error: ${message.errorMsg}`);
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
        this.setState({
            showNewGameDialog: false,
            showGameSetupDialog: true,
            showAvailableGames: false,
            availableGames: [],
            hasJoinedGame: true,
            hasJoinedTeam: true,
            playerPosn: "player1",
            currentGameData: message.msg.gameData,
        });
    }

    rcvdJoinedGameMsg(message) {
        this.setState({
            ...this.state,
            showAvailableGames: false,
            availableGames: [],
            showGameSetupDialog: true,
            hasJoinedGame: true,
            hasJoinedTeam: false,
            currentGameData: message.msg.gameData,
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
        this.setState({
            showNewGameDialog: false,
            showGameSetupDialog: true,
            showAvailableGames: false,
            availableGames: [],
            hasJoinedGame: true,
            hasJoinedTeam: true,
            playerPosn: message.msg.playerPosn,
            currentGameData: message.msg.gameData,
        });
    }

    rcvdGameDataChangedMsg(message) {
        this.setState({
            ...this.state,
            showAvailableGames: false,
            availableGames: [],
            showGameSetupDialog: true,
            currentGameData: message.msg.gameData,
        })
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
    }

    getAvailGames = async () => {
        let socketMsg = new SocketMsg(this.context.id);
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

    handleNewGameOk = async (gameName, gameType) => {
        let socketMsg = new SocketMsg(this.context.id);
        socketMsg.msgId = 'newGame';
        socketMsg.msg = {
            gameName: gameName,
            gameType: gameType,
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
        let socketMsg = new SocketMsg(this.context.id);
        socketMsg.msgId = 'joinGame';
        socketMsg.msg = {
            gameName: gameName,
        };
        this.sendSocketMsg(socketMsg);
    }

    handleLeaveGame = async (gameName) => {
        let socketMsg = new SocketMsg(this.context.id);
        socketMsg.msgId = 'leaveGame';
        socketMsg.msg = {
            gameName: gameName,
            playerPosn: this.state.playerPosn,
        };
        this.sendSocketMsg(socketMsg);
    }

    handleJoinTeam = async (gameName, playerPosn) => {
        let socketMsg = new SocketMsg(this.context.id);
        socketMsg.msgId = 'joinTeam';
        socketMsg.msg = {
            gameName: gameName,
            playerId: this.context.playerId,
            playerPosn: playerPosn,
        };
        this.sendSocketMsg(socketMsg);
    }

    handleEnterGame = (gameName) => {
        this.setState({
            ...this.state,
            showNewGameDialog: false,
            showGameSetupDialog: false,
            showAvailableGames: false,
        });

        this.props.onEnterGame(this.state.currentGameData, this.state.playerPosn);
    }


    render() {
        let availableGameTable = null;
        if (this.state.showAvailableGames && this.state.availableGames) {
            let availGameCmpnts = [];
            if (this.state.availableGames.length > 0) {
                this.state.availableGames.forEach((game, index) => {
                    availGameCmpnts.push(
                        <tr key={game.name}>
                            <td>{game.name}</td>
                            <td>{game.type}</td>
                            <td>
                                <MyButton
                                    btnClass="lobbyJoinGameBtn"
                                    btnText="View Game"
                                    onClick={this.handleJoinGame}
                                    onClickValue={game.name}>
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
                    onOk={this.handleNewGameOk}
                    onCancel={this.handleNewGameCancel} />
        }

        let gameSetupDlg = null;
        if (this.state.showGameSetupDialog) {
            let gameData = this.state.currentGameData;
            if (gameData.type === "Rook") {
                gameSetupDlg =
                    <GameSetupDialog
                        hasJoinedTeam={this.state.hasJoinedTeam}
                        enableEnterGameBtn={gameData.state === GameStates.READY_TO_START}
                        gameName={gameData.name}
                        gameType={gameData.type}
                        gameStateText={gameData.stateText}
                        player1={(gameData.player1 != null) ? gameData.player1.name : ""}
                        player2={(gameData.player2 != null) ? gameData.player2.name : ""}
                        player3={(gameData.player3 != null) ? gameData.player3.name : ""}
                        player4={(gameData.player4 != null) ? gameData.player4.name : ""}
                        onJoinTeam={this.handleJoinTeam}
                        onEnterGame={this.handleEnterGame}
                        onLeaveGame={this.handleLeaveGame}/>
            } else if (gameData.type === "ConnectionTest") {
                gameSetupDlg =
                    <ConnectionTestSetupDialog
                        hasJoinedTeam={this.state.hasJoinedTeam}
                        enableEnterGameBtn={gameData.state === GameStates.READY_TO_START}
                        gameName={gameData.name}
                        gameType={gameData.type}
                        gameStateText={gameData.stateText}
                        player1Name={(gameData.player1 != null) ? gameData.player1.name : ""}
                        player2Name={(gameData.player2 != null) ? gameData.player2.name : ""}
                        onEnterGame={this.handleEnterGame}
                        onLeaveGame={this.handleLeaveGame}/>
            }
        }

        let newGameBtn = null;
        if (!this.state.hasJoinedGame && this.state.showAvailableGames && this.context.permissions.createGame) {
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
                <div className="lobbyInfoDiv">
                    <span className="lobbyInfoMsg">Please select a game to join</span>
                </div>
                <div className="lobbyItemsArea">
                    <div className="lobbyGamesArea">
                        <div className="lobbyGamesTitleArea">
                            <div className="loggyGamesTitle"><span>Available Games</span></div>
                            {newGameBtn}
                        </div>
                        {availableGameTable}
                        {newGameDlg}
                        {gameSetupDlg}
                    </div>
                </div>
            </div>
        );
    }
}

LobbyView.contextType = AppContext;

export default LobbyView;