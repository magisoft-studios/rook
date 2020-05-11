import React, { Component } from 'react'
import cards from './Cards'

class PlayerCard extends Component {
    render() {
        let btnKey = this.props.cardKey + "btn";
        let imgKey = this.props.cardKey + "image;"
        return (
            <button
                key={btnKey}
                className={this.props.buttonClass}
                onClick={() => this.props.onClick(this.props.cardId)}>
                <img
                    key={imgKey}
                    className={this.props.imgClass}
                    src={this.props.imgSrc}
                    alt={this.props.cardId}></img>
            </button>
        );
    }
}

export default PlayerCard;
