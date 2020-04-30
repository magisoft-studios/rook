import React, { Component } from 'react'
import cards from './Cards'
import players from './Players'
import images from './Images'

class PlayerCard extends Component {
    render() {
        let cardName = this.props.name + this.props.suit;
        return (
            <div key={cardName} className={this.props.wrapperClass}>
                <img className={this.props.imgClass} src={this.props.imgSrc} alt={cardName}></img>
            </div>
        );
    }
}

export default PlayerCard;
