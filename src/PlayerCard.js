import React, { Component } from 'react'
import cards from './Cards'
import players from './Players'
import images from './Images'

class PlayerCard extends Component {
    getCardName = () => {
        return this.props.name + this.props.suit;
    }

    render() {
        return (
            <button
                type="button"
                className={this.props.buttonClass}
                onClick={() => this.props.onClick(this)}>
                <img className={this.props.imgClass} src={this.props.imgSrc} alt={this.getCardName()}></img>
            </button>
        );
    }
}

export default PlayerCard;
