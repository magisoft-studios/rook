import React, { Component } from 'react'
import cards from "./CommonCards";
import PlayerCard from "./PlayerCard";

class PlayerHand extends Component {
    render() {
        let playerCardCmpnts = [];
        let wrapperClass = "bottomPlayerCardWrapper";
        let buttonClass = "bottomPlayerCardButton";
        let imgClass = "bottomPlayerCard";

        this.props.cardList.forEach( (card, index) => {
            let imgSrc = cards[card.id];
            let key = card.id + index;
            let wrapperKey = "wrapper" + key;
            let cardKey = "card" + key;

            playerCardCmpnts.push(
                <div key={wrapperKey} className={wrapperClass}>
                    <PlayerCard
                        cardKey={cardKey}
                        cardId={card.id}
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
