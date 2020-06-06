import React, { Component } from "react";
import NewGameDialog from '../NewGameDialog';
import GameSetupDialog from '../GameSetupDialog';
import { AppContext, useAppContext } from '../ContextLib';
import MyButton from "../MyButton";
import socketIOClient from "socket.io-client";
import SocketMsg from '../SocketMsg';

const REFRESH_RATE = 5000;

class LobbyView extends Component {
    constructor(props) {
        super(props);
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
//        await this.checkStatus();
        await this.initSocketIo();
        this.getAvailGames();
//        this.updateTimerId = setInterval(async () => this.checkStatus(), REFRESH_RATE);
    }

//    componentWillUnmount() {
//        clearInterval(this.updateTimerId);
//    }

    initSocketIo = async () => {
        try {
            this.socket = await socketIOClient('/lobby', {
                query: {
                    sessionId: this.context.id,
                }
            });
            this.socket.on(`message`, this.rcvSocketMsg);
        } catch(error) {
            console.log(`Error initializing Lobby socket IO: ${error.message}`);
        }
    }

    rcvSocketMsg = (message) => {
        console.log(`Received message: ${JSON.stringify(message)}`);
        if (message.status === "SUCCESS") {
            switch (message.msgId) {
                case "availGames": {
                    if (this.state.showAvailableGames) {
                        this.setState({
                            ...this.state,
                            availableGames: message.msg.availGames,
                        });
                    }
                    break;
                }
                case "newGame": {
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
                    break;
                }
                case "joinedGame": {
                    this.setState({
                        ...this.state,
                        showAvailableGames: false,
                        availableGames: [],
                        showGameSetupDialog: true,
                        hasJoinedGame: true,
                        hasJoinedTeam: false,
                        currentGameData: message.msg.gameData,
                    })
                    break;
                }
                case "leftGame": {
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
                    break;
                }
                case "joinedTeam": {
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
                case "gameDataChanged": {
                    this.setState({
                        ...this.state,
                        showAvailableGames: false,
                        availableGames: [],
                        showGameSetupDialog: true,
                        currentGameData: message.msg.gameData,
                    })
                    break;
                }
                default: {
                    console.log(`Received invalid msgId on Lobby socket: ${message.msgId}`);
                }
            }
        }
    }

    sendSocketMsg = (socketMsg) => {
        try {
            console.log(`Sending message: ${JSON.stringify(socketMsg)}`);
            this.socket.emit(`message`, socketMsg);
        } catch (error) {
            console.log(`Error sending socket msg: ${error.message}`);
        }
    }

    getAvailGames = () => {
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

    /*
    handleLeaveGame = async (gameName) => {
        await this.getGameInfo(gameName);
        if (this.state.hasJoinedGame) {
            // Need to tell server we are leaving the game.
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    sessionId: this.context.id,
                    gameName: gameName,
                    playerPosn: this.state.playerPosn,
                })
            };
            try {
                const response = await fetch('/rook/playerLeaveGame', requestOptions);
                if (!response.ok) {
                    throw Error(response.statusText);
                } else {
                    const jsonResp = await response.json();
                    let status = jsonResp.rookResponse.status;
                    if (status === "SUCCESS") {
                        this.setState({
                            ...this.state,
                            showNewGameDialog: false,
                            showGameSetupDialog: false,
                            showAvailableGames: true,
                            hasJoinedGame: false,
                            playerPosn: null,
                            currentGameData: null,
                        });
                        //this.checkStatus();
                    } else {
                        alert("Failed to leave game: " + jsonResp.rookResponse.errorMsg);
                    }
                }
            } catch (error) {
                console.log(error);
                this.setState({
                    ...this.state,
                    showNewGameDialog: false,
                    showGameSetupDialog: false,
                    showAvailableGames: true,
                    hasJoinedGame: false,
                    playerPosn: null,
                    currentGameData: null,
                });
                //this.checkStatus();
            }
        } else {
            // We have not joined the game yet so no need to tell server.
            this.setState({
                ...this.state,
                showNewGameDialog: false,
                showGameSetupDialog: false,
                showAvailableGames: true,
                hasJoinedGame: false,
                playerPosn: null,
                currentGameData: null,
            });
            //this.checkStatus();
        }
    }
*/
    onEnterGame = (gameName) => {
        this.setState({
            ...this.state,
            showNewGameDialog: false,
            showGameSetupDialog: false,
            showAvailableGames: false,
        });
        this.props.onEnterGame(gameName, this.state.playerPosn);
    }

    render() {
        let session = this.context;

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
            gameSetupDlg =
                <GameSetupDialog
                    hasJoinedTeam={this.state.hasJoinedTeam}
                    enableEnterGameBtn={gameData.locked}
                    gameName={gameData.name}
                    gameType={gameData.type}
                    gameStateText={gameData.stateText}
                    player1={(gameData.player1 != null) ? gameData.player1.name : ""}
                    player2={(gameData.player2 != null) ? gameData.player2.name : ""}
                    player3={(gameData.player3 != null) ? gameData.player3.name : ""}
                    player4={(gameData.player4 != null) ? gameData.player4.name : ""}
                    onJoinTeam={this.handleJoinTeam}
                    onEnterGame={this.onEnterGame}
                    onLeaveGame={this.handleLeaveGame} />
        }

        let newGameBtn = null;
        if (!this.state.hasJoinedGame && this.state.showAvailableGames) {
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