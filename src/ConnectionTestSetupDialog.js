import React, { Component } from 'react'
import MyButton from "./MyButton";
import './css/GameSetupDialog.scss';

class ConnectionTestSetupDialog extends Component {
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
                        btnClass="jgNormalBtn"
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
        let player1Cmpnt = this.createPlayerComponent(this.props.player1Name, "player1");
        let player2Cmpnt = this.createPlayerComponent(this.props.player2Name, "player2");

        let leaveGameBtn =
            <MyButton
                btnClass="jgNormalBtn"
                btnText="Leave Game"
                onClick={this.props.onLeaveGame}
                onClickValue={this.props.gameName}>
            </MyButton>

        let enterGameBtn = null;
        if (this.props.enableEnterGameBtn) {
            enterGameBtn =
                <MyButton
                    btnClass="jgNormalBtn"
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
                        <td><span>{this.props.gameName}</span></td>
                    </tr>
                    <tr>
                        <td><span>Game Type:</span></td>
                        <td><span>{this.props.gameType}</span></td>
                    </tr>
                    <tr>
                        <td><span>Game Status:</span></td>
                        <td><span>{this.props.gameStateText}</span></td>
                    </tr>
                    <tr>
                        <td><span className="gameSetupPlayerLabel">Player 1:</span></td>
                        <td>{player1Cmpnt}</td>
                    </tr>
                    <tr>
                        <td><span className="gameSetupPlayerLabel">Player 2:</span></td>
                        <td>{player2Cmpnt}</td>
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

export default ConnectionTestSetupDialog;

