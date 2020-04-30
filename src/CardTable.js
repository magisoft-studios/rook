import React, { Component } from 'react'
import cards from './Cards'

class CardTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topPlayerCard: this.props.topPlayerCard,
            leftPlayerCard: this.props.leftPlayerCard,
            rightPlayerCard: this.props.rightPlayerCard,
            bottomPlayerCard: this.props.bottomPlayerCard,
        }
    }

    setTopPlayerCard = (card) => {
        this.setState({topPlayerCard: card});
    }

    setBottomPlayerCard = (card) => {
        this.setState({bottomPlayerCard: card});
    }

    render() {
        return (
            <div className="tableArea">
                <div className="tableTopPlayerCardArea"></div>
                <div className="tableLeftPlayerCardArea"></div>
                <div className="tableRightPlayerCardArea"></div>
                <div className="tableBottomPlayerCardArea">{this.state.bottomPlayerCard}</div>
            </div>
        );
    }
}

export default CardTable;
