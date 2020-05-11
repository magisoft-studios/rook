import React, { Component } from 'react'
import TableCard from './TableCard';
import TABLE_BG from './images/card-table.png';

class CardTable extends Component {
    constructor(props) {
        super(props);
    }

/*             <div className="tableArea" style={{ backgroundImage: `url(${TABLE_BG})` }}>
            <div className="tableArea" style={{ backgroundImage: `url(${bgSrc})` }}>
 */
    render() {
        let bgSrc = process.env.PUBLIC_URL + '/card-table.png';
        console.log('TABLE_BG = ' + TABLE_BG);
        console.log('bgSrc = ' + bgSrc);
        let bgSrc2 = 'localhost/rook/public/card-table.png'

        return (
            <div className="tableArea" style={{ backgroundImage: `url(${bgSrc})` }}>
                <div className="tableTopCardArea"><TableCard id={this.props.topCardId} /></div>
                <div className="tableLeftCardArea"><TableCard id={this.props.leftCardId} /></div>
                <div className="tableRightCardArea"><TableCard id={this.props.rightCardId} /></div>
                <div className="tableBottomCardArea"><TableCard id={this.props.bottomCardId} /></div>
            </div>
        );
    }
}

export default CardTable;
