import React, { Component } from 'react';
import MyButton from './MyButton';
import './css/GameInfoArea.scss';

class GameInfoArea extends Component {

    render() {
        let gameData = this.props.gameData;
        let team1Players = gameData["player1"].name + ", " + gameData["player3"].name;
        let team2Players = gameData["player2"].name + ", " + gameData["player4"].name;
        let highBid = "";
        let highBidPlayerName = "";
        if (gameData.highBidPlayerPosn != null) {
            highBidPlayerName = gameData[gameData.highBidPlayerPosn].name;
            highBid = gameData.highBid;
        }
        let trumpSuit = gameData.trumpSuit ? gameData.trumpSuit : "";

        return (
            <div className="gameInfoArea">
                <div className="gameTitleArea">
                    <span className="gameTitle">Rook</span>
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
                        btnText="Refresh"
                        onClick={() => this.props.onRefresh()}>
                    </MyButton>
                </div>
            </div>
        );
    }
}

export default GameInfoArea;
