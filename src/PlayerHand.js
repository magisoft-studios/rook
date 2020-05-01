import React, { Component } from 'react'
import cards from "./Cards";
import PlayerCard from "./PlayerCard";

class PlayerHand extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardList: this.props.cardList,
        }
    }
    render() {
        let playerCardCmpnts = [];
        let wrapperClass = "bottomPlayerCardWrapper";
        let buttonClass = "bottomPlayerCardButton";
        let imgClass = "bottomPlayerCard";

        this.state.cardList.forEach( (card, index) => {
            let imgSrc = cards["card" + card.value + card.suit];
            playerCardCmpnts.push(
                <div key={card.name} className={wrapperClass}>
                    <PlayerCard
                        card={card}
                        buttonClass={buttonClass}
                        onClick={this.props.onClick}
                        imgClass={imgClass}
                        imgSrc={imgSrc} />
                </div>
            );
        });

        return (
            <div className="bottomPlayerCardArea">
                {playerCardCmpnts}
            </div>
        );
    }
}

export default PlayerHand;
