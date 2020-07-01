import React, { Component } from 'react'
import cards from "./CommonCards";

class TableCard extends Component {
    render() {
        return (
            <img className="tableCard" src={this.props.imgSrc} alt="?"></img>
        );
    }
}

export default TableCard;
