import React, { Component } from 'react'
import cards from './Cards'
import players from './Players'
import images from './Images'
import Card from './Card';
import PlayerCard from './PlayerCard';
import PlayerHand from './PlayerHand';
import OpponentCard from './OpponentCard';
import CardTable from './CardTable';

const NUM_CARDS_PER_PLAYER = 13;

class Game extends Component {
    constructor(props) {
        super(props);
        this.playerHand = [];
        this.playerHandRef = React.createRef();
        this.cardTableRef = React.createRef();
        this.state = {
            status: "Initializing",
        }
        this.deal();
    }

    deal = () => {
        let hand = [];

        hand.push(new Card("10 Black", 10, "Black"));
        hand.push(new Card("11 Black", 11, "Black"));
        hand.push(new Card("12 Black", 12, "Black"));
        hand.push(new Card("13 Black", 13, "Black"));
        hand.push(new Card("14 Black", 14, "Black"));
        hand.push(new Card("10 Red", 10, "Red"));
        hand.push(new Card("11 Red", 11, "Red"));
        hand.push(new Card("12 Red", 12, "Red"));
        hand.push(new Card("14 Red", 14, "Red"));
        hand.push(new Card("13 Green", 13, "Green"));
        hand.push(new Card("14 Green", 14, "Green"));
        hand.push(new Card("10 Yellow", 10, "Yellow"));
        hand.push(new Card("14 Yellow", 14, "Yellow"));

        this.playerHand = hand;
    }

    handleUpdateClick = () => {
        fetch('/rook')
            .then(res => res.json())
            .then(response => this.setState({ status: response.status }));
    }

    handleDealClick = () => {
        let cardTblState = {
            topPlayerCard: null,
            leftPlayerCard: null,
            rightPlayerCard: null,
            bottomPlayerCard: null,
        }
        this.cardTableRef.current.setState(cardTblState);

        this.deal();
        this.playerHandRef.current.setState({cardList: this.playerHand});
    }

    handleCardClick = (selPlayerCard) => {
        //alert("Selected " + selPlayerCard.getCardName());
        // Add the card to the card table.
        let playedCard =
            <PlayerCard
                card={selPlayerCard.props.card}
                buttonClass={selPlayerCard.props.buttonClass}
                imgClass={selPlayerCard.props.imgClass}
                imgSrc={selPlayerCard.props.imgSrc}
                onClick={selPlayerCard.props.onClick} />

        this.cardTableRef.current.setState({bottomPlayerCard: playedCard});

        // Remove the card from the Player's hand.
        let filteredHand = this.playerHand.filter( (item, index, array) => {
            // if true item is pushed to results and the iteration continues
            // returns empty array if nothing found
            return (item.name !== selPlayerCard.props.card.name);
        });

        this.playerHand = filteredHand;
        this.playerHandRef.current.setState({cardList: this.playerHand});
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

    render() {
        let topPlayerCardCmpnts = [];
        for (let i = 0; i < NUM_CARDS_PER_PLAYER; i++) {
            topPlayerCardCmpnts.push( this.createVertOpponentCard("top", i) );
        }

        let leftPlayerCardCmpnts = [];
        let rightPlayerCardCmpnts = [];
        for (let i = 0; i < NUM_CARDS_PER_PLAYER; i++) {
            leftPlayerCardCmpnts.push( this.createHorizOpponentCard("left", i) );
            rightPlayerCardCmpnts.push( this.createHorizOpponentCard("right", i) );
        }

        return (
            <div className="gameView">
                <div className="gameArea">
                    <div className="gameInfoArea">
                        <div className="logoContainer">
                            <img className="logo" src={images.logo} alt="Jennings Games"></img>
                            <span className="logoJennings">Jennings</span>
                            <span className="logoGames">Games</span>
                        </div>
                        <div className={"buttonPanel"}>
                            <button type="button" className="dealBtn" onClick={() => this.handleDealClick()}>Deal</button>
                            <button type="button" className="updateBtn" onClick={() => this.handleUpdateClick()}>Update</button>
                        </div>
                        <div className={"statusPanel"}>
                            <span className="statusText">{this.state.status}</span>
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
                    <CardTable ref={this.cardTableRef}/>;
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
                                cardList={this.playerHand}
                                onClick={this.handleCardClick} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;
