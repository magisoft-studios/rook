import React, { Component } from 'react'
// import card1 from './images/Card - 14 Black.png'
import cards from './Cards'
import players from './Players'
import images from './Images'

class Game extends Component {
    state = {
        players: [],
    }


    render() {
        let topPlayerCards = [];
        let NUM_PLAYER_CARDS = 13;
        for (let i = 0; i < NUM_PLAYER_CARDS; i++) {
            let cardEle =
                <div key={"topPlayerCard" + i} className="topPlayerCardWrapper">
                    <img className="topPlayerCard" src={cards.cardBack} alt="Card 1"></img>
                </div>;
            topPlayerCards.push(cardEle);
        }

        let leftPlayerCards = [];
        for (let i = 0; i < NUM_PLAYER_CARDS; i++) {
            let cardEle =
                <div key={"leftPlayerCard" + i} className="leftPlayerCardWrapper">
                    <img className="leftPlayerCard" src={cards.cardBackHoriz} alt="Card 1"></img>
                </div>;
            leftPlayerCards.push(cardEle);
        }

        let rightPlayerCards = [];
        for (let i = 0; i < NUM_PLAYER_CARDS; i++) {
            let cardEle =
                <div key={"rightPlayerCard" + i} className="rightPlayerCardWrapper">
                    <img className="rightPlayerCard" src={cards.cardBackHoriz} alt="Card 1"></img>
                </div>;
            rightPlayerCards.push(cardEle);
        }

        let bottomPlayerCards = [];
        bottomPlayerCards.push(
            <div key={"bottomPlayerCard1"} className="bottomPlayerCardWrapper">
                <img className="bottomPlayerCard" src={cards.card14Green} alt="Card 1"></img>
            </div>);
        bottomPlayerCards.push(
            <div key={"bottomPlayerCard2"} className="bottomPlayerCardWrapper">
                <img className="bottomPlayerCard" src={cards.card14Yellow} alt="Card 2"></img>
            </div>);
        bottomPlayerCards.push(
            <div key={"bottomPlayerCard3"} className="bottomPlayerCardWrapper">
                <img className="bottomPlayerCard" src={cards.card14Black} alt="Card 2"></img>
            </div>);
        bottomPlayerCards.push(
            <div key={"bottomPlayerCard4"} className="bottomPlayerCardWrapper">
                <img className="bottomPlayerCard" src={cards.card14Red} alt="Card 2"></img>
            </div>);
        bottomPlayerCards.push(
            <div key={"bottomPlayerCard5"} className="bottomPlayerCardWrapper">
                <img className="bottomPlayerCard" src={cards.card11Black} alt="Card 2"></img>
            </div>);
        bottomPlayerCards.push(
            <div key={"bottomPlayerCard6"} className="bottomPlayerCardWrapper">
                <img className="bottomPlayerCard" src={cards.card14Yellow} alt="Card 2"></img>
            </div>);
        bottomPlayerCards.push(
            <div key={"bottomPlayerCard7"} className="bottomPlayerCardWrapper">
                <img className="bottomPlayerCard" src={cards.card12Black} alt="Card 2"></img>
            </div>);
        bottomPlayerCards.push(
            <div key={"bottomPlayerCard8"} className="bottomPlayerCardWrapper">
                <img className="bottomPlayerCard" src={cards.card14Green} alt="Card 2"></img>
            </div>);
        bottomPlayerCards.push(
            <div key={"bottomPlayerCard9"} className="bottomPlayerCardWrapper">
                <img className="bottomPlayerCard" src={cards.card13Black} alt="Card 2"></img>
            </div>);
        bottomPlayerCards.push(
            <div key={"bottomPlayerCard10"} className="bottomPlayerCardWrapper">
                <img className="bottomPlayerCard" src={cards.card14Red} alt="Card 2"></img>
            </div>);
        bottomPlayerCards.push(
            <div key={"bottomPlayerCard11"} className="bottomPlayerCardWrapper">
                <img className="bottomPlayerCard" src={cards.card14Black} alt="Card 2"></img>
            </div>);
        bottomPlayerCards.push(
            <div key={"bottomPlayerCard12"} className="bottomPlayerCardWrapper">
                <img className="bottomPlayerCard" src={cards.card14Yellow} alt="Card 2"></img>
            </div>);
        bottomPlayerCards.push(
            <div key={"bottomPlayerCard13"} className="bottomPlayerCardWrapper">
                <img className="bottomPlayerCard" src={cards.card14Green} alt="Card 2"></img>
            </div>);


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
                            {topPlayerCards}
                        </div>
                    </div>
                    <div className="leftPlayerArea">
                        <img className="playerImage" src={players.teddy} alt="Player 2"></img>
                        <div className="leftPlayerCardArea">
                            {leftPlayerCards}
                        </div>
                    </div>
                    <div className="tableArea">
                    </div>
                    <div className="rightPlayerArea">
                        <img className="playerImage" src={players.abe} alt="Player 3"></img>
                        <div className="rightPlayerCardArea">
                            {rightPlayerCards}
                        </div>
                    </div>
                    <div className="bottomPlayerArea">
                        <img className="selectedPlayerImage" src={players.tom} alt="Player 4"></img>
                        <div className="bottomPlayerCardArea">
                            {bottomPlayerCards}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;
