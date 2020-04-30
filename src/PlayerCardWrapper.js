import React, { Component } from 'react'
import PlayerCard from './PlayerCard';

class PlayerCardWrapper extends Component {
    getCardName = () => {
        return this.props.name + this.props.suit;
    }

    render() {
        return (
            <div key={this.getCardName()} className={this.props.wrapperClass}>
                <PlayerCard
                    buttonClass={this.props.buttonClass}
                    onClick={this.props.onClick}
                    imgClass={this.props.imgClass}
                    imgSrc={this.props.imgSrc} />
            </div>
        );
    }
}

export default PlayerCardWrapper;
