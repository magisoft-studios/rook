import React, { Component } from 'react'

class OpponentCard extends Component {
    render() {
        let wrapperKey = this.props.cardKey + "wrapper";
        let imgKey = this.props.cardKey + "image;"
        return (
            <div key={wrapperKey} className={this.props.wrapperClass}>
                <img key={imgKey} className={this.props.imgClass} src={this.props.imgSrc} alt="Card Back"></img>
            </div>
        );
    }
}

export default OpponentCard;
