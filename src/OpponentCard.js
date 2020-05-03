import React, { Component } from 'react'

class OpponentCard extends Component {
    render() {
        return (
            <div className={this.props.wrapperClass}>
                <img className={this.props.imgClass} src={this.props.imgSrc} alt="Card Back"></img>
            </div>
        );
    }
}

export default OpponentCard;
