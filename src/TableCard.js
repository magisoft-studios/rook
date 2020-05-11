import React, { Component } from 'react'
import cards from "./Cards";

class TableCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let imgSrc = cards[this.props.id];

        return (
            <img className="tableCard" src={imgSrc} alt={this.props.id}></img>
        );
    }
}

export default TableCard;
