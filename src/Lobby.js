import React, { Component } from "react";

class Lobby extends Component {
    constructor(props) {
        super(props);
    }

    handleCreateGame = (event) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                playerId: this.playerId
            })
        };
        fetch('/rook/deal', requestOptions)
            .then(res => res.json())
            .then(res => {
                let newData = res.rookResponse.gameData;
                this.setState({ gameData: newData });
            });
    }

    handleJoinGame(event) {

    }

    render() {
        return (
            <div className="lobbyView">
                <div className="lobbyWelcomeDiv"><span className="lobbyWelcomeMsg">Welcome to the Game Lobby</span></div>
                <div className="lobbyInfoDiv"><span className="lobbyInfoMsg">Please select a game to join</span></div>
                <div className="lobbyItemsArea">
                    <div className="lobbyGamesArea">
                        <div className="lobbyGamesTitleArea">
                            <div className="loggyGamesTitle"><span>Available Games</span></div>
                            <button type="button" className="lobbyCreateGameBtn" onClick={() => this.handleCreateGame()}>Create New Game</button>
                        </div>
                        <ul>
                            <li>Game 1<button type="button"  className="lobbyJoinGameBtn">Join Game</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Lobby;