import React, { Component } from 'react'

class PlayerCard extends Component {
    render() {
        return (
            <button
                type="button"
                className={this.props.buttonClass}
                onClick={() => this.props.onClick(this.props.cardId)}>
                <img className={this.props.imgClass} src={this.props.imgSrc} alt={this.props.cardId}></img>
            </button>
        );
    }
}

export default PlayerCard;
