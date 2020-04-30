import React, { Component } from 'react'
import cards from './Cards'
import players from './Players'
import images from './Images'
import Card from './Card';
import PlayerCard from './PlayerCard';

const NUM_CARDS_PER_PLAYER = 13;

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
        }
        this.deal();
    }

    deal = () => {
        // Player 1.
        let hand1 = [];
        let suit = "Black";
        for (let i = 1; i < NUM_CARDS_PER_PLAYER + 1; i++) {
            hand1.push(new Card(toString(i), i, suit));
        }
        this.state.players.push(hand1);

        // Player 2.
        let hand2 = [];
        suit = "Green";
        for (let i = 1; i < NUM_CARDS_PER_PLAYER + 1; i++) {
            hand2.push(new Card(toString(i), i, suit));
        }
        this.state.players.push(hand2);

        // Player 3.
        let hand3 = [];
        suit = "Red";
        for (let i = 1; i < NUM_CARDS_PER_PLAYER + 1; i++) {
            hand3.push(new Card(toString(i), i, suit));
        }
        this.state.players.push(hand3);

        // Player 4.
        let hand4 = [];
        hand4.push(new Card(toString(11), 11, "Black"));
        hand4.push(new Card(toString(12), 12, "Black"));
        hand4.push(new Card(toString(13), 13, "Black"));
        hand4.push(new Card(toString(14), 14, "Black"));
        hand4.push(new Card(toString(14), 14, "Red"));
        hand4.push(new Card(toString(14), 14, "Green"));
        hand4.push(new Card(toString(14), 14, "Yellow"));
        hand4.push(new Card(toString(14), 14, "Black"));
        hand4.push(new Card(toString(14), 14, "Red"));
        hand4.push(new Card(toString(14), 14, "Green"));
        hand4.push(new Card(toString(14), 14, "Yellow"));
        hand4.push(new Card(toString(14), 14, "Black"));
        hand4.push(new Card(toString(14), 14, "Red"));
        this.state.players.push(hand4);
    }

    render() {
        let player1Hand = this.state.players[0];
        let topPlayerCardCmpnts = [];
        let wrapperClass = "oppCardVertWrapper";
        let imgClass = "oppCardVert";
        let imgSrc = cards.cardBack;
        for (let i = 0; i < player1Hand.length; i++) {
            let card = player1Hand[i];
                /*
                <div key={"topPlayerCard" + i} className="topPlayerCardWrapper">
                    <img className="topPlayerCard" src={cards.cardBack} alt="Card 1"></img>
                </div>;
                */
            let cardEle = <PlayerCard name={card.name} value={card.value} suit={card.suit} wrapperClass={wrapperClass} imgClass={imgClass} imgSrc={imgSrc} />;
            topPlayerCardCmpnts.push(cardEle);
        }

        let player2Hand = this.state.players[1];
        let leftPlayerCardCmpnts = [];
        wrapperClass = "oppCardHorizWrapper";
        imgClass = "oppCardHoriz";
        imgSrc = cards.cardBackHoriz;
        for (let i = 0; i < player2Hand.length; i++) {
            let card = player2Hand[i];
            let cardEle = <PlayerCard name={card.name} value={card.value} suit={card.suit} wrapperClass={wrapperClass} imgClass={imgClass} imgSrc={imgSrc} />;
            leftPlayerCardCmpnts.push(cardEle);
        }

        let player3Hand = this.state.players[2];
        let rightPlayerCardCmpnts = [];
        wrapperClass = "oppCardHorizWrapper";
        imgClass = "oppCardHoriz";
        imgSrc = cards.cardBackHoriz;
        player3Hand.forEach( (card, index) => {
            rightPlayerCardCmpnts.push(
                <PlayerCard name={card.name} value={card.value} suit={card.suit} wrapperClass={wrapperClass} imgClass={imgClass} imgSrc={imgSrc} />
            );
        });

        let player4Hand = this.state.players[3];
        let bottomPlayerCardCmpnts = [];
        wrapperClass = "bottomPlayerCardWrapper";
        imgClass = "bottomPlayerCard";
        player4Hand.forEach( (card, index) => {
            let imgSrc = cards["card" + card.value + card.suit];
            bottomPlayerCardCmpnts.push(
                <PlayerCard name={card.name} value={card.value} suit={card.suit} wrapperClass={wrapperClass} imgClass={imgClass} imgSrc={imgSrc} />
            );
        });

        return (
            <div className="gameView">
                <div className="gameArea">
                    <div className="gameInfoArea">
                        <div className="logoContainer">
                            <img className="logo" src={images.logo} alt="Jennings Games"></img>
                            <span className="logoJennings">Jennings</span>
                            <span className="logoGames">Games</span>
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
                    <div className="tableArea">
                    </div>
                    <div className="rightPlayerArea">
                        <img className="playerImage" src={players.abe} alt="Player 3"></img>
                        <div className="rightPlayerCardArea">
                            {rightPlayerCardCmpnts}
                        </div>
                    </div>
                    <div className="bottomPlayerArea">
                        <img className="selectedPlayerImage" src={players.tom} alt="Player 4"></img>
                        <div className="bottomPlayerCardArea">
                            {bottomPlayerCardCmpnts}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;
