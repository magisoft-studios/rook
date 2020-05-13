import React, { Component } from 'react'
import TableCard from './TableCard';
import TABLE_BG from './images/card-table.png';
import PlayerStates from './PlayerStates';
import GameStates from './GameStates';
import {AppContext} from "./ContextLib";
import Game from "./Game";

class CardTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameData: this.props.gameData
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.gameData.state !== prevState.gameData.state) {
            return { gameData: nextProps.gameData };
        } else {
            return null;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.gameData.state !== this.props.gameData.state) {
            this.setState({gameData: this.props.gameData});
        }
    }


    /*  Tried different ways to load the table background image from the public folder.
          <div className="tableArea" style={{ backgroundImage: `url(${TABLE_BG})` }}>
          <div className="tableArea" style={{ backgroundImage: `url(${bgSrc})` }}>
          let bgSrc = process.env.PUBLIC_URL + '/card-table.png';
          let bgSrc2 = 'localhost/rook/public/card-table.png'
          let bgSrc = process.env.PUBLIC_URL + '/card-table.png';
          let bgSrc2 = 'localhost/rook/public/card-table.png'
    */
    render() {
        let bgSrc = process.env.PUBLIC_URL + '/card-table.png';

        if (this.state.gameData) {
            let playerPosn = this.context.currentGame.playerPosn;
            console.log("CardTable: playerPosn = " + playerPosn);
            if (this.state.gameData.state === GameStates.DEAL)
            {
                if (this.state.gameData[playerPosn].state === PlayerStates.DEAL) {
                    return (
                        <div className="tableArea" style={{ backgroundImage: `url(${bgSrc})` }}>
                            <div className="dealDiv">
                                <button className="dealBtn" onClick={() => this.props.onDealClick()}>Deal</button>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className="tableArea" style={{ backgroundImage: `url(${bgSrc})` }}>
                            <div className="dealDiv">
                                <span className="dealSpan">{this.state.gameData.stateText}</span>
                            </div>
                        </div>
                    );
                }
            } else {
                let topCardId = "";
                let leftCardId = "";
                let rightCardId = "";
                let bottomCardId = "";
                return (
                    <div className="tableArea" style={{ backgroundImage: `url(${bgSrc})` }}>
                        <div className="tableTopCardArea"><TableCard id={topCardId} /></div>
                        <div className="tableLeftCardArea"><TableCard id={leftCardId} /></div>
                        <div className="tableRightCardArea"><TableCard id={rightCardId} /></div>
                        <div className="tableBottomCardArea"><TableCard id={bottomCardId} /></div>
                    </div>
                );
            }
        } else {
            let topCardId = "";
            let leftCardId = "";
            let rightCardId = "";
            let bottomCardId = "";
            return (
                <div className="tableArea" style={{ backgroundImage: `url(${bgSrc})` }}>
                    <div className="tableTopCardArea"><TableCard id={topCardId} /></div>
                    <div className="tableLeftCardArea"><TableCard id={leftCardId} /></div>
                    <div className="tableRightCardArea"><TableCard id={rightCardId} /></div>
                    <div className="tableBottomCardArea"><TableCard id={bottomCardId} /></div>
                </div>
            );
        }
    }
}

CardTable.contextType = AppContext;

export default CardTable;
