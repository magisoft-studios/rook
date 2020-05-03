import React, { Component } from 'react'
import cards from './Cards'
import players from './Players'
import Card from './Card';
import PlayerHand from './PlayerHand';
import OpponentCard from './OpponentCard';
import CardTable from './CardTable';

class Game extends Component {
    constructor(props) {
        super(props);
        this.playerId = "player1";
        this.playerHandRef = React.createRef();
        this.cardTableRef = React.createRef();
        this.posns = {
            bottomPlayerId: "",
            leftPlayerId: "",
            topPlayerId: "",
            rightPlayerId: "",
        };
        this.state = {
            gameData: {
                status: "Initializing"
            }
        }
        this.calcPlayerPosns(this.playerId);
    }

    calcPlayerPosns(playerId) {
        switch (playerId) {
            case "player1":
                this.posns.bottomPlayerId = "player1";
                this.posns.leftPlayerId = "player2";
                this.posns.topPlayerId = "player3";
                this.posns.rightPlayerId = "player4";
                break;
            case "player2":
                this.posns.bottomPlayerId = "player2";
                this.posns.leftPlayerId = "player3";
                this.posns.topPlayerId = "player4";
                this.posns.rightPlayerId = "player1";
                break;
            case "player3":
                this.posns.bottomPlayerId = "player3";
                this.posns.leftPlayerId = "player4";
                this.posns.topPlayerId = "player1";
                this.posns.rightPlayerId = "player2";
                break;
            case "player4":
                this.posns.bottomPlayerId = "player4";
                this.posns.leftPlayerId = "player1";
                this.posns.topPlayerId = "player2";
                this.posns.rightPlayerId = "player3";
                break;
            default:
                this.posns.bottomPlayerId = "player1";
                this.posns.leftPlayerId = "player2";
                this.posns.topPlayerId = "player3";
                this.posns.rightPlayerId = "player4";
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
                playerId: this.playerId
            })
        };
        fetch('/rook/getGameData', requestOptions)
            .then(res => res.json())
            .then(res => {
                //alert("got response: " + JSON.stringify(res));
                this.setState({ gameData: res.rookResponse.gameData });
            });
    }

    handleDealClick = () => {
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

    handleCardClick = (selCardId) => {
        //alert("Selected " + selPlayerCard.getCardName());
        // Add the card to the card table.
        /*
        let playedCard =
            <PlayerCard
                card={selPlayerCard.props.card}
                buttonClass={selPlayerCard.props.buttonClass}
                imgClass={selPlayerCard.props.imgClass}
                imgSrc={selPlayerCard.props.imgSrc}
                onClick={selPlayerCard.props.onClick} />

        this.cardTableRef.current.setState({bottomPlayerCard: playedCard});

        // Remove the card from the Player's hand.
        let filteredCards = this.playerCards.filter( (item, index, array) => {
            // if true item is pushed to results and the iteration continues
            // returns empty array if nothing found
            return (item.name !== selPlayerCard.props.card.name);
        });

        this.playerCards = filteredCards;
        this.playerHandRef.current.setState({cardList: this.playerCards});
         */
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                playerId: this.playerId,
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
        let key = player + index;
        let wrapperClass = "oppCardVertWrapper";
        let imgClass = "oppCardVert";
        let imgSrc = cards.cardBack;
        return (
            <OpponentCard
                key={key}
                wrapperClass={wrapperClass}
                imgClass={imgClass}
                imgSrc={imgSrc} />
        );
    }

    createHorizOpponentCard(player, index) {
        let key = player + index;
        let wrapperClass = "oppCardHorizWrapper";
        let imgClass = "oppCardHoriz";
        let imgSrc = cards.cardBackHoriz;
        return (
            <OpponentCard
                key={key}
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
            let playerData = this.state.gameData[this.posns.bottomPlayerId];
            let cards = playerData.cards;
            if (cards) {
                for (let i = 0; i < cards.length; i++) {
                    let card = cards[i];
                    bottomPlayerCards.push(new Card(card.id, card.name, card.value, card.pointValue, card.suit));
                }
            }

            playerData = this.state.gameData[this.posns.leftPlayerId];
            for (let i = 0; i < playerData.numCards; i++) {
                leftPlayerCardCmpnts.push(this.createHorizOpponentCard(playerData.name, i));
            }

            playerData = this.state.gameData[this.posns.topPlayerId];
            for (let i = 0; i < playerData.numCards; i++) {
                topPlayerCardCmpnts.push(this.createVertOpponentCard(playerData.name, i));
            }

            playerData = this.state.gameData[this.posns.rightPlayerId];
            for (let i = 0; i < playerData.numCards; i++) {
                rightPlayerCardCmpnts.push(this.createHorizOpponentCard(playerData.name, i));
            }
        }

        let topCardId = "";
        let leftCardId = "";
        let rightCardId = "";
        let bottomCardId = "";

        if (this.state.gameData.table) {
            topCardId = this.state.gameData.table[this.posns.topPlayerId];
            leftCardId = this.state.gameData.table[this.posns.leftPlayerId];
            rightCardId = this.state.gameData.table[this.posns.rightPlayerId];
            bottomCardId = this.state.gameData.table[this.posns.bottomPlayerId];
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
                        <img className="playerImage" src={players.george} alt="Player 1"></img>
                        <div className="topPlayerCardArea">
                            {topPlayerCardCmpnts}
                        </div>
                    </div>
                    <div className="leftPlayerArea">
                        <img className="playerImage" src={players.teddy} alt="Player 2"></img>
                        <div className="leftPlayerCardArea">
                            {leftPlayerCardCmpnts}
                        </div>
                    </div>
                    <CardTable
                        ref={this.cardTableRef}
                        topCardId={topCardId}
                        leftCardId={leftCardId}
                        rightCardId={rightCardId}
                        bottomCardId={bottomCardId} />;
                    <div className="rightPlayerArea">
                        <img className="playerImage" src={players.abe} alt="Player 3"></img>
                        <div className="rightPlayerCardArea">
                            {rightPlayerCardCmpnts}
                        </div>
                    </div>
                    <div className="bottomPlayerArea">
                        <img className="selectedPlayerImage" src={players.tom} alt="Player 4"></img>
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

export default Game;
