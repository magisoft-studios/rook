import React, { Component } from 'react';
import MyButton from './MyButton';
import './css/GameInfoArea.scss';

class GameInfoArea extends Component {

    render() {
        let gameData = this.props.gameData;
        let player1 = gameData["player1"];
        let player2 = gameData["player2"];
        let player3 = gameData["player3"];
        let player4 = gameData["player4"];
        let player1Name = player1 ? player1.name : "";
        let player2Name = player2 ? player2.name : "";
        let player3Name = player3 ? player3.name : "";
        let player4Name = player4 ? player4.name : "";
        let team1Players = player1Name + ", " + player3Name;
        let team2Players = player2Name + ", " + player4Name;
        let highBid = "";
        let highBidPlayerName = "";
        if (gameData.highBidPlayerPosn != null) {
            let highBidPlayer = gameData[gameData.highBidPlayerPosn];
            highBidPlayerName = highBidPlayer ? highBidPlayer.name : "";
            highBid = gameData.highBid;
        }
        let trumpSuit = gameData.trumpSuit ? gameData.trumpSuit : "";

        return (
            <div className="gameInfoArea">
                <div className="gameTitleArea">
                    <span className="gameTitle">{gameData.type}</span>
                </div>
                <div className="gameInfoDiv">
                    <span className="gameName">{gameData.name}</span>
                </div>
                <div className="gameInfoDiv">
                    <span className="teamTitle">{gameData.team1.name}</span>
                    <div className="gameStatusEntryDiv">
                        <span className="playerName">{team1Players}</span>
                    </div>
                    <div className="gameStatusEntryDiv">
                        <span className="teamScoreTitle">Score:</span>
                        <span className="teamScore">{gameData.team1.score}</span>
                    </div>
                </div>
                <div className="gameInfoDiv">
                    <span className="teamTitle">{gameData.team2.name}</span>
                    <div className="gameStatusEntryDiv">
                        <span className="playerName">{team2Players}</span>
                    </div>
                    <div className="gameStatusEntryDiv">
                        <span className="teamScoreTitle">Score:</span>
                        <span className="teamScore">{gameData.team2.score}</span>
                    </div>
                </div>
                <div className="gameInfoDiv">
                    <span className="statusTitle">Hand Status</span>
                    <div className="gameStatusEntryDiv">
                        <span className="teamScoreTitle">High Bidder:</span>
                        <span className="teamScore">{highBidPlayerName}</span>
                    </div>
                    <div className="gameStatusEntryDiv">
                        <span className="teamScoreTitle">High Bid:</span>
                        <span className="teamScore">{highBid}</span>
                    </div>
                    <div className="gameStatusEntryDiv">
                        <span className="teamScoreTitle">Trump Suit:</span>
                        <span className="teamScore">{trumpSuit}</span>
                    </div>
                    <div className="gameStatusEntryDiv">
                        <span className="teamScoreTitle">Team 1 Score:</span>
                        <span className="teamScore">{gameData.team1.handScore}</span>
                    </div>
                    <div className="gameStatusEntryDiv">
                        <span className="teamScoreTitle">Team 2 Score:</span>
                        <span className="teamScore">{gameData.team2.handScore}</span>
                    </div>
                </div>
                <div className="gameInfoDiv">
                    <span className="statusTitle">Current Status</span>
                    <div className="gameStatusEntryDiv">
                        <span className="statusText">{gameData.stateText}</span>
                    </div>
                </div>
                <div className="gameInfoCtrlPnlDiv">
                    <MyButton
                        btnClass="gameInfoRefreshBtn"
                        btnText="Refresh Game Data"
                        onClick={this.props.onRefresh}>
                    </MyButton>
                    <MyButton
                        btnClass="gameInfoCamReloadBtn"
                        btnText="Reload Camera"
                        onClick={this.props.onReloadCam}>
                    </MyButton>
                    <MyButton
                        btnClass="gameInfoExitBtn"
                        btnText="Exit Game"
                        onClick={this.props.onExit}>
                    </MyButton>
                </div>
            </div>
        );
    }
}

export default GameInfoArea;
