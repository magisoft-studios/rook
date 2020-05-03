import React, { Component } from 'react'
import TableCard from './TableCard';

class CardTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topCardId: props.topCardId,
            leftCardId: props.leftCardId,
            rightCardId: props.rightCardId,
            bottomCardId: props.bottomCardId,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ((nextProps.topCardId !== prevState.topCardId) ||
            (nextProps.leftCardId !== prevState.leftCardId) ||
            (nextProps.rightCardId !== prevState.rightCardId) ||
            (nextProps.bottomCardId !== prevState.bottomCardId)) {
            return {
                topCardId: nextProps.topCardId,
                leftCardId: nextProps.leftCardId,
                rightCardId: nextProps.rightCardId,
                bottomCardId: nextProps.bottomCardId,
            };
        } else {
            return null;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if ((prevProps.topCardId !== this.props.topCardId) ||
            (prevProps.leftCardId !== this.props.leftCardId) ||
            (prevProps.rightCardId !== this.props.rightCardId) ||
            (prevProps.bottomCardId !== this.props.bottomCardId)) {
            this.setState({
                topCardId: this.topCardId,
                leftCardId: this.leftCardId,
                rightCardId: this.rightCardId,
                bottomCardId: this.bottomCardId,
            });
        }
    }

    render() {
        return (
            <div className="tableArea">
                <div className="tableTopCardArea"><TableCard id={this.state.topCardId} /></div>
                <div className="tableLeftCardArea"><TableCard id={this.state.leftCardId} /></div>
                <div className="tableRightCardArea"><TableCard id={this.state.rightCardId} /></div>
                <div className="tableBottomCardArea"><TableCard id={this.state.bottomCardId} /></div>
            </div>
        );
    }
}

export default CardTable;
