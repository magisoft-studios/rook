import React, { Component } from 'react'
import MyButton from "./MyButton";

class GameSetupDialog extends Component {
    handlePlayerJoinBtnClick = (playerPosn) => {
        this.props.onJoinTeam(this.props.gameName, playerPosn)
    }

    createPlayerComponent = (playerName, playerPosn) => {
        let playerCmpnt = null;
        if (playerName) {
            playerCmpnt = <span className="playerNameText">{playerName}</span>
        } else {
            if (! this.props.hasJoinedTeam) {
                playerCmpnt =
                    <MyButton
                        btnClass="joinGameBtn"
                        btnText="Join"
                        onClick={this.handlePlayerJoinBtnClick}
                        onClickValue={playerPosn}>
                    </MyButton>
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

        let leaveGameBtn =
            <MyButton
                btnClass="leaveGameBtn"
                btnText="Leave Game"
                onClick={this.props.onLeaveGame}
                onClickValue={this.props.gameName}>
            </MyButton>

        let enterGameBtn = null;
        if (this.props.enableEnterGameBtn) {
            enterGameBtn =
                <MyButton
                    btnClass="enterGameBtn"
                    btnText="Enter Game"
                    onClick={this.props.onEnterGame}
                    onClickValue={this.props.gameName}>
                </MyButton>
        }

        return (
            <div className="gameSetupDlgDiv">
                <table className="gameSetupGameTbl">
                    <tbody>
                    <tr>
                        <td><span>Game Name:</span></td>
                        <td><span className="gameSetupGameText">{this.props.gameName}</span></td>
                    </tr>
                    <tr>
                        <td><span className="gameSetupGameLabel">Game Type:</span></td>
                        <td><span className="gameSetupGameText">{this.props.gameType}</span></td>
                    </tr>
                    <tr>
                        <td><span className="gameSetupGameLabel">Game Status:</span></td>
                        <td><span className="gameSetupGameText">{this.props.gameStateText}</span></td>
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
                    </tbody>
                </table>
                <div className="gameSetupBtnPnl">
                    {leaveGameBtn}
                    {enterGameBtn}
                </div>
            </div>
        );
    }
}

export default GameSetupDialog;

