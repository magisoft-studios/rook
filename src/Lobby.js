import React, { Component } from "react";
import NewGameDialog from './NewGameDialog';
import GameSetupDialog from './GameSetupDialog';
import { AppContext, useAppContext } from './ContextLib';

const REFRESH_RATE = 500;

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNewGameDialog: false,
            showGameSetupDialog: false,
            showAvailableGames: true,
            availableGames: [],
            hasJoinedGame: false,
            currentGameData: null,
        }
    }

    componentDidMount() {
        this.checkStatus();
    }

    checkStatus = () => {
        if (this.state.showAvailableGames) {
            this.getAvailableGames();
        } else if (this.state.showGameSetupDialog) {
            this.getGameInfo(this.state.currentGameData.name);
        }
    }

    getAvailableGames = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: this.context.sessionId,
            })
        };
        fetch('/rook/getAvailableGames', requestOptions)
            .then(res => res.json())
            .then(res => {
                let status = res.rookResponse.status;
                if (status === "SUCCESS") {
                    if (this.state.showAvailableGames) {
                        this.setState({
                            availableGames: res.rookResponse.availableGames,
                        });
                    }
                    setTimeout(this.checkStatus, REFRESH_RATE);
                }
            });
    }

    getGameInfo = (gameName) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: this.context.sessionId,
                gameName: gameName,
            })
        };
        fetch('/rook/getGameInfo', requestOptions)
            .then(res => res.json())
            .then(res => {
                let status = res.rookResponse.status;
                if (status === "SUCCESS") {
                    this.setState({
                        showNewGameDialog: false,
                        showGameSetupDialog: true,
                        showAvailableGames: false,
                        currentGameData: res.rookResponse.gameInfo,
                    });
                    setTimeout(this.checkStatus, REFRESH_RATE);
                } else {
                    alert("Could not find game: " + res.rookResponse.errorMsg);
                }
            });
    }

    handleCreateNewGame = () => {
        this.setState({
            showNewGameDialog: true,
            showGameSetupDialog: false,
            showAvailableGames: false,
        });
    }

    handleNewGameOk = (gameName, gameType) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: this.context.sessionId,
                gameName: gameName,
                gameType: gameType,
            })
        };
        fetch('/rook/newGame', requestOptions)
            .then(res => res.json())
            .then(res => {
                let status = res.rookResponse.status;
                if (status === "SUCCESS") {
                    this.setState({
                        showNewGameDialog: false,
                        showGameSetupDialog: true,
                        showAvailableGames: false,
                        availableGames: null,
                        hasJoinedGame: true,
                        currentGameData: res.rookResponse.gameData,
                    });
                } else {
                    alert("Failed creating new game: " + res.rookResponse.errorMsg);
                }
                setTimeout(this.checkStatus, REFRESH_RATE);
            });
    }

    handleNewGameCancel = (event) => {
        this.setState({
            showNewGameDialog: false,
            showGameSetupDialog: false,
            showAvailableGames: true,
        });
    }

    handleJoinGame = (gameName) => {
        this.setState({
            showAvailableGames: false,
            availableGames: [],
        })
        this.getGameInfo(gameName);
    }

    handlePlayerJoinedGame = (gameName, playerPosn) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: this.context.sessionId,
                gameName: gameName,
                playerPosn: playerPosn,
                playerId: this.context.playerId,
            })
        };
        fetch('/rook/playerJoinGame', requestOptions)
            .then(res => res.json())
            .then(res => {
                let status = res.rookResponse.status;
                if (status === "SUCCESS") {
                    this.setState({
                        showNewGameDialog: false,
                        showGameSetupDialog: true,
                        showAvailableGames: false,
                        availableGames: null,
                        hasJoinedGame: true,
                        currentGameData: res.rookResponse.gameData,
                    });
                } else {
                    alert("Failed to join game: " + res.rookResponse.errorMsg);
                }
                setTimeout(this.checkStatus, REFRESH_RATE);
            });
    }

    handleStartGame(event) {
    }

    render() {
        let availableGameTable = null;
        if (this.state.showAvailableGames) {
            let availGameCmpnts = [];
            if (this.state.availableGames.length > 0) {
                this.state.availableGames.forEach((game, index) => {
                    console.log("Adding game [" + game.name + "]");
                    availGameCmpnts.push(
                        <tr key={game.name}>
                            <td>{game.name}</td>
                            <td>{game.type}</td>
                            <td>
                                <button
                                    type="button"
                                    className="lobbyJoinGameBtn"
                                    onClick={() => this.handleJoinGame(game.name)}>Join
                                </button>
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
                    hasJoinedGame={this.state.hasJoinedGame}
                    gameName={gameData.name}
                    gameType={gameData.type}
                    player1={gameData.player1.name}
                    player2={gameData.player2.name}
                    player3={gameData.player3.name}
                    player4={gameData.player4.name}
                    onJoin={this.handlePlayerJoinedGame}
                    onStartGame={this.handleStartGame} />
        }

        let sessionInfo = this.context;
        return (
            <div className="lobbyView">
                <div className="lobbyWelcomeDiv"><span className="lobbyWelcomeMsg">Welcome to the Game Lobby {sessionInfo.playerName}</span>
                </div>
                <div className="lobbyInfoDiv"><span className="lobbyInfoMsg">Please select a game to join</span>
                </div>
                <div className="lobbyItemsArea">
                    <div className="lobbyGamesArea">
                        <div className="lobbyGamesTitleArea">
                            <div className="loggyGamesTitle"><span>Available Games</span></div>
                            <button
                                type="button"
                                className="lobbyNewGameBtn"
                                onClick={() => this.handleCreateNewGame()}>Create New Game
                            </button>
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

Lobby.contextType = AppContext;

export default Lobby;