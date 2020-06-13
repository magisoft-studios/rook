import React, { Component } from 'react';
import MyButton from './MyButton';
import './css/PlayerCard.scss';

class PlayerCard extends Component {
    render() {
        let btnKey = this.props.cardKey + "btn";
        let imgKey = this.props.cardKey + "image;"
        return (
            <MyButton
                key={btnKey}
                btnClass={this.props.buttonClass}
                onClick={this.props.onClick}
                onClickValue={this.props.cardId}
                imgKey={imgKey}
                imgClass={this.props.imgClass}
                imgSrc={this.props.imgSrc}
                imgAlt={this.props.cardId}>
            </MyButton>
        );
    }
}

export default PlayerCard;
