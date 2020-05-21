import React, { Component } from "react";
import NewGameDialog from './NewGameDialog';
import GameSetupDialog from './GameSetupDialog';
import { AppContext, useAppContext } from './ContextLib';
import Game from './Game';
import MyButton from "./MyButton";

const REFRESH_RATE = 5000;

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNewGameDialog: false,
            showGameSetupDialog: false,
            showAvailableGames: true,
            availableGames: [],
            hasJoinedGame: false,
            playerPosn: "",
            currentGameData: null,
        };
    }

    async componentDidMount() {
        await this.checkStatus();
        this.updateTimerId = setInterval(async () => this.checkStatus(), REFRESH_RATE);
    }

    componentWillUnmount() {
        clearInterval(this.updateTimerId);
    }

    checkStatus = async () => {
        if (this.state.showAvailableGames) {
            await this.getAvailableGames();
        } else if (this.state.showGameSetupDialog) {
            await this.getGameInfo(this.state.currentGameData.name);
        }
    }

    getAvailableGames = async () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                sessionId: this.context.id,
            })
        };
        try {
            const response = await fetch('/rook/getAvailableGames', requestOptions);
            if (!response.ok) {
                throw Error(response.statusText);
            } else {
                const jsonResp = await response.json();
                let status = jsonResp.rookResponse.status;
                if (status === "SUCCESS") {
                    if (this.state.showAvailableGames) {
                        this.setState({
                            ...this.state,
                            availableGames: jsonResp.rookResponse.availableGames,
                        });
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    getGameInfo = async (gameName) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                sessionId: this.context.id,
                gameName: gameName,
            })
        };
        try {
            const response = await fetch('/rook/getGameInfo', requestOptions);
            if (!response.ok) {
                throw Error(response.statusText);
            } else {
                const jsonResp = await response.json();
                let status = jsonResp.rookResponse.status;
                if (status === "SUCCESS") {
                    this.setState({
                        ...this.state,
                        currentGameData: jsonResp.rookResponse.gameInfo,
                    });
                } else {
                    alert("Could not find game: " + jsonResp.rookResponse.errorMsg);
                }
            }
        } catch (error) {
            console.log(error);
        }
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
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                sessionId: this.context.id,
                gameName: gameName,
                gameType: gameType,
            })
        };
        try {
            const response = await fetch('/rook/newGame', requestOptions);
            if (!response.ok) {
                throw Error(response.statusText);
            } else {
                const jsonResp = await response.json();
                let status = jsonResp.rookResponse.status;
                if (status === "SUCCESS") {
                    this.setState({
                        showNewGameDialog: false,
                        showGameSetupDialog: true,
                        showAvailableGames: false,
                        availableGames: null,
                        hasJoinedGame: true,
                        playerPosn: "player1",
                        currentGameData: jsonResp.rookResponse.gameData,
                    });
                    await this.checkStatus();
                } else {
                    alert("Failed creating new game: " + jsonResp.rookResponse.errorMsg);
                }
            }
        } catch (error) {
            console.log(error);
        }
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
        await this.getGameInfo(gameName);
        this.setState({
            ...this.state,
            showAvailableGames: false,
            availableGames: [],
            showGameSetupDialog: true,
        })
        await this.checkStatus();
    }

    handlePlayerJoinedGame = async (gameName, playerPosn) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                sessionId: this.context.id,
                gameName: gameName,
                playerPosn: playerPosn,
                playerId: this.context.playerId,
            })
        };
        try {
            const response = await fetch('/rook/playerJoinGame', requestOptions);
            if (!response.ok) {
                throw Error(response.statusText);
            } else {
                const jsonResp = await response.json();
                let status = jsonResp.rookResponse.status;
                if (status === "SUCCESS") {
                    this.setState({
                        showNewGameDialog: false,
                        showGameSetupDialog: true,
                        showAvailableGames: false,
                        availableGames: null,
                        hasJoinedGame: true,
                        playerPosn: playerPosn,
                        currentGameData: jsonResp.rookResponse.gameData,
                    });
                    this.checkStatus();
                } else {
                    alert("Failed to join game: " + jsonResp.rookResponse.errorMsg);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

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
                        this.checkStatus();
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
                this.checkStatus();
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
            this.checkStatus();
        }
    }

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
                    console.log("Adding game [" + game.name + "]");
                    availGameCmpnts.push(
                        <tr key={game.name}>
                            <td>{game.name}</td>
                            <td>{game.type}</td>
                            <td>
                                <MyButton
                                    btnClass="lobbyJoinGameBtn"
                                    btnText="Join"
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
                    hasJoinedGame={this.state.hasJoinedGame}
                    enableEnterGameBtn={gameData.locked}
                    gameName={gameData.name}
                    gameType={gameData.type}
                    gameStateText={gameData.stateText}
                    player1={gameData.player1.name}
                    player2={gameData.player2.name}
                    player3={gameData.player3.name}
                    player4={gameData.player4.name}
                    onJoin={this.handlePlayerJoinedGame}
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
                <div className="lobbyWelcomeDiv"><span className="lobbyWelcomeMsg">Welcome to the Game Lobby {session.playerName}</span>
                </div>
                <div className="lobbyInfoDiv"><span className="lobbyInfoMsg">Please select a game to join</span>
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

Lobby.contextType = AppContext;

export default Lobby;