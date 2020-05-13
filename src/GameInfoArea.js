import React, { Component } from 'react'

class GameInfoArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameData: props.gameData,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.gameData.state !== prevState.gameData.state) {
            return { gameData: nextProps.gameData };
        } else {
            return null;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.gameData.state !== this.props.gameData.state) {
            this.setState({gameData: this.props.gameData});
        }
    }

    render() {
        return (
            <div className="gameInfoArea">
                <div className="gameTitleArea">
                    <span className="gameTitle">Rook</span>
                </div>
                <div className="gameInfoDiv">
                    <span className="gameName">{this.state.gameData.name}</span>
                    <span className="teamTitle">{this.state.gameData.team1.name}</span>
                    <span className="playerName">{this.state.gameData.team1.player1Id}</span>
                    <span className="playerName">{this.state.gameData.team1.player2Id}</span>
                    <div className="teamScoreDiv">
                        <span className="teamScoreTitle">Score:</span>
                        <span className="teamScore">{this.state.gameData.team1.score}</span>
                    </div>
                    <span className="teamTitle">{this.state.gameData.team2.name}</span>
                    <span className="playerName">{this.state.gameData.team2.player1Id}</span>
                    <span className="playerName">{this.state.gameData.team2.player2Id}</span>
                    <div className="teamScoreDiv">
                        <span className="teamScoreTitle">Score:</span>
                        <span className="teamScore">{this.state.gameData.team2.score}</span>
                    </div>
                </div>
                <div className="gameStatusDiv">
                    <span className="statusTitle">Game Status</span>
                    <span className="statusText">{this.state.gameData.stateText}</span>
                </div>
                <div className="controlPanelDiv">
                    <button type="button" className="dealBtn" onClick={() => this.handleDealClick()}>Deal</button>
                    <button type="button" className="updateBtn" onClick={() => this.handleUpdateClick()}>Update</button>
                </div>
            </div>
        );
    }
}

export default GameInfoArea;
