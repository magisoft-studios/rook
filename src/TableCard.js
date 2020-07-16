import React, { Component } from 'react'

class TableCard extends Component {
    render() {
        return (
            <img className="tableCard" src={this.props.imgSrc} alt="?"></img>
        );
    }
}

export default TableCard;
