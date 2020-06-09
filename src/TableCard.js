import React, { Component } from 'react'
import cards from "./Cards";

class TableCard extends Component {
    render() {
        let imgSrc = cards[this.props.id];

        return (
            <img className="tableCard" src={imgSrc} alt="?"></img>
        );
    }
}

export default TableCard;
