import React, { Component } from 'react'
import {AppContext} from "./ContextLib";
import Lobby from "./Lobby";

class GameSetupDialog extends Component {
    constructor(props) {
        super(props);
    }

    createPlayerComponent = (playerName, playerPosn) => {
        let playerCmpnt = null;
        if (playerName) {
            playerCmpnt = <span className="playerNameText">{playerName}</span>
        } else {
            if (! this.props.hasJoinedGame) {
                playerCmpnt =
                    <button type="button"
                            className="joinGameBtn"
                            onClick={() => this.props.onJoin(this.props.gameName, playerPosn)}>Join</button>
            } else {
                playerCmpnt = <span className="playerNameText">"Waiting for player..."</span>
            }
        }
        return playerCmpnt;
    }

    render() {
        // Team 1
        let player1Cmpnt = this.createPlayerComponent(this.props.player1, "player1");
        let player3Cmpnt = this.createPlayerComponent(this.props.player3, "player3");

        // Team 2
        let player2Cmpnt = this.createPlayerComponent(this.props.player2, "player2");
        let player4Cmpnt = this.createPlayerComponent(this.props.player4, "player4");

        return (
            <div className="gameSetupDlgDiv">
                <table className="gameSetupGameTbl">
                    <tr>
                        <td><span>Game Name:</span></td>
                        <td><span className="gameSetupGameText">{this.props.gameName}</span></td>
                    </tr>
                    <tr>
                        <td><span className="gameSetupGameLabel">Game Type:</span></td>
                        <td><span className="gameSetupGameText">{this.props.gameType}</span></td>
                    </tr>
                    <tr>
                        <td><span className="gameSetupGameLabel">Team 1</span></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td><span className="gameSetupPlayerLabel">Player 1:</span></td>
                        <td>{player1Cmpnt}</td>
                    </tr>
                    <tr>
                        <td><span className="gameSetupPlayerLabel">Player 2:</span></td>
                        <td>{player3Cmpnt}</td>
                    </tr>
                    <tr>
                        <td><span className="gameSetupGameLabel">Team 2</span></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td><span className="gameSetupPlayerLabel">Player 1:</span></td>
                        <td>{player2Cmpnt}</td>
                    </tr>
                    <tr>
                        <td><span className="gameSetupPlayerLabel">Player 2:</span></td>
                        <td>{player4Cmpnt}</td>
                    </tr>
                </table>
            </div>
        );
    }
}

GameSetupDialog.contextType = AppContext;

export default GameSetupDialog;

