import React, { Component } from 'react'

class GameInfoArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameData: props.gameData,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ((nextProps.gameData.state !== prevState.gameData.state)  ||
            (nextProps.gameData.stateText !== prevState.gameData.stateText)) {
            return { gameData: nextProps.gameData };
        } else {
            return null;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if ((prevProps.gameData.state !== this.props.gameData.state)  ||
            (prevProps.gameData.stateText !== this.props.gameData.stateText)) {
            this.setState({gameData: this.props.gameData});
        }
    }

    render() {
        let gameData = this.state.gameData;
        let team1Players = gameData["player1"].name + ", " + gameData["player3"].name;
        let team2Players = gameData["player2"].name + ", " + gameData["player4"].name;
        let highBid = "Test";
        let highBidPlayerName = "Test";
        if (gameData.highBidPlayer != null) {
            highBidPlayerName = gameData[gameData.highBidPlayer].name;
            highBid = gameData.highBid;
        }
        let trumpSuit = "Yellow"; //gameData.trumpSuit;

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
                    <span className="statusTitle">Game Status</span>
                    <div className="gameStatusEntryDiv">
                        <span className="statusText">{gameData.stateText}</span>
                    </div>
                    <div className="gameStatusEntryDiv">
                        <span className="teamScoreTitle">High Bid:</span>
                        <span className="teamScore">{highBid}</span>
                    </div>
                    <div className="gameStatusEntryDiv">
                        <span className="teamScoreTitle">High Bidder:</span>
                        <span className="teamScore">{highBidPlayerName}</span>
                    </div>
                    <div className="gameStatusEntryDiv">
                        <span className="teamScoreTitle">Trump Suit:</span>
                        <span className="teamScore">{trumpSuit}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default GameInfoArea;
