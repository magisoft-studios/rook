import React, { Component } from 'react'
import cards from './Cards'
import players from './Players'
import Card from './Card';
import PlayerHand from './PlayerHand';
import OpponentCard from './OpponentCard';
import CardTable from './CardTable';
import {AppContext} from "./ContextLib";
import GameSetupDialog from "./GameSetupDialog";

const REFRESH_RATE = 5000;

class Game extends Component {
    constructor(props) {
        super(props);
        this.playerHandRef = React.createRef();
        this.cardTableRef = React.createRef();
        this.posns = {
            bottomPlayerId: "",
            leftPlayerId: "",
            topPlayerId: "",
            rightPlayerId: "",
        };
        this.state = {
            gameId: this.props.gameId,
            playerPosn: this.props.playerPosn,
            gameData: {
                status: "Initializing"
            }
        }
        this.calcPlayerPosns(this.props.playerPosn);
    }

    calcPlayerPosns(playerPosn) {
        switch (playerPosn) {
            case "player1":
                this.posns.bottomPlayerPosn = "player1";
                this.posns.leftPlayerPosn = "player2";
                this.posns.topPlayerPosn = "player3";
                this.posns.rightPlayerPosn = "player4";
                break;
            case "player2":
                this.posns.bottomPlayerPosn = "player2";
                this.posns.leftPlayerPosn = "player3";
                this.posns.topPlayerPosn = "player4";
                this.posns.rightPlayerPosn = "player1";
                break;
            case "player3":
                this.posns.bottomPlayerPosn = "player3";
                this.posns.leftPlayerPosn = "player4";
                this.posns.topPlayerPosn = "player1";
                this.posns.rightPlayerPosn = "player2";
                break;
            case "player4":
                this.posns.bottomPlayerPosn = "player4";
                this.posns.leftPlayerPosn = "player1";
                this.posns.topPlayerPosn = "player2";
                this.posns.rightPlayerPosn = "player3";
                break;
            default:
                this.posns.bottomPlayerPosn = "player1";
                this.posns.leftPlayerPosn = "player2";
                this.posns.topPlayerPosn = "player3";
                this.posns.rightPlayerPosn = "player4";
                break;
        }
    }

    componentDidMount = () => {
        this.getGameData();
    }

    handleUpdateClick = () => {
        this.getGameData();
    }

    getGameData = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: this.context.id
            })
        };
        fetch('/rook/getGameData', requestOptions)
            .then(res => res.json())
            .then(res => {
                //alert("got response: " + JSON.stringify(res));
                this.setState({ gameData: res.rookResponse.gameData });
                setTimeout(this.getGameData, REFRESH_RATE);
            });
    }

    handleDealClick = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: this.context.id
            })
        };
        fetch('/rook/deal', requestOptions)
            .then(res => res.json())
            .then(res => {
                let newData = res.rookResponse.gameData;
                this.setState({ gameData: newData });
            });
    }

    handleCardClick = (selCardId) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: this.context.id,
                cardId: selCardId })
        };
        fetch('/rook/playCard', requestOptions)
            .then(res => res.json())
            .then(res => {
                let newData = res.rookResponse.gameData;
                this.setState({ gameData: newData });
            });
    }

    createVertOpponentCard(player, index) {
        let cardKey = player + index;
        let wrapperClass = "oppCardVertWrapper";
        let imgClass = "oppCardVert";
        let imgSrc = cards.cardBack;
        return (
            <OpponentCard
                key={cardKey}
                cardKey={cardKey}
                wrapperClass={wrapperClass}
                imgClass={imgClass}
                imgSrc={imgSrc} />
        );
    }

    createHorizOpponentCard(player, index) {
        let cardKey = player + index;
        let wrapperClass = "oppCardHorizWrapper";
        let imgClass = "oppCardHoriz";
        let imgSrc = cards.cardBackHoriz;
        return (
            <OpponentCard
                key={cardKey}
                cardKey={cardKey}
                wrapperClass={wrapperClass}
                imgClass={imgClass}
                imgSrc={imgSrc} />
        );
    }

    getTeamId(playerId) {
        let teamId = "team1";
        if (playerId === "player2" || playerId === "player4") {
            teamId = "team2"
        }
        return teamId;
    }

    render() {
        let topPlayerCardCmpnts = [];
        let leftPlayerCardCmpnts = [];
        let rightPlayerCardCmpnts = [];
        let bottomPlayerCards = [];

        if (this.state.gameData.team1) {
            let playerData = this.state.gameData[this.posns.bottomPlayerPosn];
            let cards = playerData.cards;
            if (cards) {
                for (let i = 0; i < cards.length; i++) {
                    let card = cards[i];
                    bottomPlayerCards.push(new Card(card.id, card.name, card.value, card.pointValue, card.suit));
                    //bottomPlayerCards.push(new Card("card14Yellow", "card14Yellow", 14, 10, "yellow"));
                }
            }

            playerData = this.state.gameData[this.posns.leftPlayerPosn];
            for (let i = 0; i < playerData.numCards; i++) {
                leftPlayerCardCmpnts.push(this.createHorizOpponentCard(playerData.name, i));
            }

            playerData = this.state.gameData[this.posns.topPlayerPosn];
            for (let i = 0; i < playerData.numCards; i++) {
                topPlayerCardCmpnts.push(this.createVertOpponentCard(playerData.name, i));
            }

            playerData = this.state.gameData[this.posns.rightPlayerPosn];
            for (let i = 0; i < playerData.numCards; i++) {
                rightPlayerCardCmpnts.push(this.createHorizOpponentCard(playerData.name, i));
            }
        }

        let topCardId = "";
        let leftCardId = "";
        let rightCardId = "";
        let bottomCardId = "";

        if (this.state.gameData.table) {
            topCardId = this.state.gameData.table[this.posns.topPlayerPosn];
            leftCardId = this.state.gameData.table[this.posns.leftPlayerPosn];
            rightCardId = this.state.gameData.table[this.posns.rightPlayerPosn];
            bottomCardId = this.state.gameData.table[this.posns.bottomPlayerPosn];
        }

        let topPlayerImg = "";
        let leftPlayerImg = "";
        let rightPlayerImg = "";
        let bottomPlayerImg = "";
        if (this.state.gameData.table) {
            console.log("getting player image for top player")
            console.log("topPlayerPosn = " + this.posns.topPlayerPosn);
            topPlayerImg = this.state.gameData[this.posns.topPlayerPosn].imgName;
            leftPlayerImg = this.state.gameData[this.posns.leftPlayerPosn].imgName;
            rightPlayerImg = this.state.gameData[this.posns.rightPlayerPosn].imgName;
            bottomPlayerImg = this.state.gameData[this.posns.bottomPlayerPosn].imgName;
        }

        return (
            <div className="gameView">
                <div className="gameArea">
                    <div className="gameInfoArea">
                        <div className="gameTitleArea">
                            <span className="gameTitle">Rook</span>
                            <span className="teamTitle">Team 1</span>
                            <span className="teamTitle">Tom</span>
                            <span className="teamTitle">George</span>
                            <span className="teamTitle">Team 2</span>
                            <span className="teamTitle">Teddy</span>
                            <span className="teamTitle">Abe</span>
                        </div>
                        <div className={"buttonPanel"}>
                            <button type="button" className="dealBtn" onClick={() => this.handleDealClick()}>Deal</button>
                            <button type="button" className="updateBtn" onClick={() => this.handleUpdateClick()}>Update</button>
                        </div>
                        <div className={"statusPanel"}>
                            <span className="statusText">{this.state.gameData.status}</span>
                        </div>
                    </div>
                    <div className="topPlayerArea">
                        <div className="playerImageDiv">
                            <img className="playerImage" src={players[topPlayerImg]} alt="Player 1"></img>
                        </div>
                        <div className="topPlayerCardArea">
                            {topPlayerCardCmpnts}
                        </div>
                    </div>
                    <div className="leftPlayerArea">
                        <div className="leftPlayerAreaImageDiv">
                            <div className="playerImageDiv">
                                <img className="playerImage" src={players[leftPlayerImg]} alt="Player 2"></img>
                            </div>
                        </div>
                        <div className="leftPlayerCardArea">
                            {leftPlayerCardCmpnts}
                        </div>
                    </div>
                    <CardTable
                        ref={this.cardTableRef}
                        topCardId={topCardId}
                        leftCardId={leftCardId}
                        rightCardId={rightCardId}
                        bottomCardId={bottomCardId} />
                    <div className="rightPlayerArea">
                        <div className="righttPlayerAreaImageDiv">
                            <div className="playerImageDiv">
                                <img className="playerImage" src={players[rightPlayerImg]} alt="Player 3"></img>
                            </div>
                        </div>
                        <div className="rightPlayerCardArea">
                            {rightPlayerCardCmpnts}
                        </div>
                    </div>
                    <div className="bottomPlayerArea">
                        <div className="playerImageDiv">
                            <img className="playerImage" src={players[bottomPlayerImg]} alt="Player 4"></img>
                        </div>
                        <div className="bottomPlayerCardArea">
                            <PlayerHand
                                ref={this.playerHandRef}
                                cardList={bottomPlayerCards}
                                onClick={this.handleCardClick} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Game.contextType = AppContext;

export default Game;
