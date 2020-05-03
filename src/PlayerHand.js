import React, { Component } from 'react'
import cards from "./Cards";
import PlayerCard from "./PlayerCard";

class PlayerHand extends Component {
    constructor(props) {
        super(props);
        /*
        this.state = {
            cardList: props.cardList,
        }
        */
    }
/*
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.cardList.length !== prevState.cardList.length) {
            return { cardList: nextProps.cardList };
        } else {
            return null;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.cardList.length !== this.props.cardList.length) {
            this.setState({cardList: this.props.cardList});
        }
    }
*/
    render() {
        let playerCardCmpnts = [];
        let wrapperClass = "bottomPlayerCardWrapper";
        let buttonClass = "bottomPlayerCardButton";
        let imgClass = "bottomPlayerCard";

        this.props.cardList.forEach( (card, index) => {
            let imgSrc = cards[card.id];
            playerCardCmpnts.push(
                <div key={card.id} className={wrapperClass}>
                    <PlayerCard
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
