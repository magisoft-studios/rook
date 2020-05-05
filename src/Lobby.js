import React, { Component } from "react";
import NewGameDialog from './NewGameDialog';
import GameSetupDialog from './GameSetupDialog';
import { AppContext, useAppContext } from './ContextLib';

class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNewGameDialog: false,
            showGameSetupDialog: false,
            showAvailableGames: true,
            availableGames: [],
            hasJoinedGame: false,
            gameName: "",
            gameType: "",
            player1: "",
            player2: "",
            player3: "",
            player4: "",
        }
    }

    handleCreateNewGame = () => {
        this.setState({
            showNewGameDialog: true,
            showGameSetupDialog: false,
            showAvailableGames: false,
        });
    }

    handleNewGameOk = (gameName, gameType) => {
        /*
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                playerId: this.playerId
            })
        };
        fetch('/rook/newGame', requestOptions)
            .then(res => res.json())
            .then(res => {
                let newData = res.rookResponse.gameData;
                this.setState({ availableGames: res.rookResponse.availableGames });
            });

         */
        let tmpAvailGames = this.state.availableGames.slice();
        tmpAvailGames.push({gameName: gameName, gameType: gameType});
        this.setState({
            showNewGameDialog: false,
            showGameSetupDialog: false,
            showAvailableGames: true,
            availableGames: tmpAvailGames,
            gameName: gameName,
            gameType: gameType,
        });
    }

    handleNewGameCancel = (event) => {
        this.setState({
            showNewGameDialog: false,
            showGameSetupDialog: false,
            showAvailableGames: true,
        });
    }

    handleJoinGame = () => {
        this.setState({
            showNewGameDialog: false,
            showGameSetupDialog: true,
            showAvailableGames: false,
        });
    }

    handlePlayerJoinedGame = (playerPosn) => {
        //alert(this.context.playerName + " joined game at position " + playerPosn);
        let newState = JSON.parse(JSON.stringify(this.state));
        newState.hasJoinedGame = true;
        newState[playerPosn] = this.context.playerName;
        this.setState(newState);
    }

    handleStartGame(event) {
    }

    render() {
        let availableGameTable = null;
        if (this.state.showAvailableGames) {
            let availGameCmpnts = [];
            if (this.state.availableGames.length > 0) {
                this.state.availableGames.forEach((game, index) => {
                    console.log("Adding game [" + game.gameName + "]");
                    availGameCmpnts.push(
                        <tr key={game.gameName}>
                            <td>{game.gameName}</td>
                            <td>{game.gameType}</td>
                            <td>
                                <button
                                    type="button"
                                    className="lobbyJoinGameBtn"
                                    onClick={() => this.handleJoinGame()}>Join
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
            gameSetupDlg =
                <GameSetupDialog
                    hasJoinedGame={this.state.hasJoinedGame}
                    gameName={this.state.gameName}
                    gameType={this.state.gameType}
                    player1={this.state.player1}
                    player2={this.state.player2}
                    player3={this.state.player3}
                    player4={this.state.player4}
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