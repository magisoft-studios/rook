import React, { Component } from 'react'
import TableCard from './TableCard';

class CardTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="tableArea">
                <div className="tableTopCardArea"><TableCard id={this.props.topCardId} /></div>
                <div className="tableLeftCardArea"><TableCard id={this.props.leftCardId} /></div>
                <div className="tableRightCardArea"><TableCard id={this.props.rightCardId} /></div>
                <div className="tableBottomCardArea"><TableCard id={this.props.bottomCardId} /></div>
            </div>
        );
    }
}

export default CardTable;
