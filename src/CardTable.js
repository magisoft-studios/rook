import React, { Component } from 'react'
import TableCard from './TableCard';
import TABLE_BG from './images/card-table.png';
import PlayerStates from './PlayerStates';
import GameStates from './GameStates';
import {AppContext} from "./ContextLib";
import Game from "./Game";
import Cards from "./Cards";
import PlayerCard from "./PlayerCard";
import KittyCard from "./KittyCard";

class CardTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameData: this.props.gameData,
            bidValue: "Pass",
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ((nextProps.gameData.state !== prevState.gameData.state)  ||
            (nextProps.gameData.stateText !== prevState.gameData.stateText)) {
            return {
                gameData: nextProps.gameData,
                bidValue: "Pass",
            };
        } else {
            return null;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if ((prevProps.gameData.state !== this.props.gameData.state)  ||
            (prevProps.gameData.stateText !== this.props.gameData.stateText)) {
            this.setState({
                gameData: this.props.gameData,
                bidValue: "Pass",
            });
        }
    }

    createKittyCards = (cards, show) => {
        let kittyCards = [];
        cards.forEach( (card, index) => {
            let cardKey = "kittyCard" + index;
            let wrapperKey = "kittyCardWrapper" + index;
            let wrapperClass = "kittyCardWrapper";
            let buttonClass = "kittyCardButton";
            let imgClass = "kittyCardImg";
            let imgSrc = show ? Cards[card.id] : Cards.cardBack;
            kittyCards.push(
                <div key={wrapperKey} className={wrapperClass}>
                    <KittyCard
                        cardKey={cardKey}
                        cardId={cardKey}
                        buttonClass={buttonClass}
                        onClick={this.clickedKittyCard}
                        imgClass={imgClass}
                        imgSrc={imgSrc} />
                </div>
            );
        });
        return kittyCards;
    }

    clickedKittyCard = (cardId) => {
        alert("Clicked kitty card: " + cardId);
    }

    handleBidSelect = (event) => {
        this.setState({
            ...this.state,
            bidValue: event.target.value
        });
    }

    calcBidOptions = (gameData) => {
        let highBid = gameData.highBid;
        let bidOptions = [];
        let minBid = 70;
        let nextBid = (highBid >= minBid) ? highBid + 5 : minBid;
        let maxBid = 180;
        bidOptions.push(
            <option key="Pass" value="Pass">Pass</option>
        )
        for (let i = nextBid; i <= maxBid; i+=5) {
            console.log("Adding bid option: " + i);
            bidOptions.push(
                <option key={i} value={i}>{i}</option>
            )
        }
        return bidOptions;
    }

    calcBidText = (player) => {
        let bidText = "";
        let bidValue = player.bid;
        if (player.state === PlayerStates.BID) {
            bidText = "???";
        } else {
            if (bidValue < 0) {
                bidText = "Pass";
            } else if (bidValue === 0) {
                bidText = "None";
            } else {
                bidText = bidValue.toString();
            }
        }
        return bidText;
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
            let gameData = this.state.gameData;
            let gameState = gameData.state;
            let playerPosn = this.context.currentGame.playerPosn;
            let player = gameData[playerPosn];
            let playerState = player.state;
            console.log("CardTable: playerPosn = " + playerPosn + " playerState = " + playerState);

            if (gameState === GameStates.DEAL)
            {
                if (playerState === PlayerStates.DEAL) {
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
                                <span className="dealSpan">{gameData.stateText}</span>
                            </div>
                        </div>
                    );
                }
            } else if ((gameState >= GameStates.WAIT_FOR_BID) &&
                       (gameState <= GameStates.BID_WON)) {
                let kittyCards = this.createKittyCards(gameData.kitty, false);
                let playerBidArea = null;
                if (playerState === PlayerStates.BID) {
                    let bidOptions = this.calcBidOptions(gameData);
                    playerBidArea =
                        <div className="currentPlayerBidArea">
                            <select
                                className="bidSelectInput"
                                id="bidSelect"
                                name="bidSelect"
                                value={this.state.bidValue}
                                onChange={this.handleBidSelect}>
                                {bidOptions}
                            </select>
                            <button
                                className="enterBidBtn"
                                onClick={() => this.props.onBidClick(this.state.bidValue)}>Enter Bid</button>
                        </div>;
                } else if (playerState === PlayerStates.BID_WON) {
                    let kittyCards = this.createKittyCards(gameData.kitty, false);
                    let bidText = "You won the bid at " + this.calcBidText(player);
                    playerBidArea =
                        <div className="bidWonBidArea">
                            <span className="bidWonText">{bidText}</span>
                            <button
                                className="bidWonBtn"
                                onClick={() => this.props.onBidWonClick()}>Name Trump</button>
                        </div>;
                } else {
                    let bidText = this.calcBidText(player);
                    playerBidArea = <div className="bottomPlayerBidArea">
                        <span className="playerBidTextTitle">Bid:</span>
                        <span className="playerBidText">{bidText}</span>
                    </div>;
                }

                let topPlayer = gameData[this.props.playerPosns.topPlayerPosn];
                let leftPlayer = gameData[this.props.playerPosns.leftPlayerPosn];
                let rightPlayer = gameData[this.props.playerPosns.rightPlayerPosn];

                let topPlyrBidText = this.calcBidText(topPlayer);
                let leftPlyrBidText = this.calcBidText(leftPlayer);
                let rightPlyrBidText = this.calcBidText(rightPlayer);

                let topPlyrBidTextClass = "playerBidText";
                if (topPlayer.state === PlayerStates.BID) {
                    topPlyrBidTextClass = "biddingPlayerText";
                }

                let leftPlyrBidTextClass = "playerBidText";
                if (leftPlayer.state === PlayerStates.BID) {
                    leftPlyrBidTextClass = "biddingPlayerText";
                }

                let rightPlyrBidTextClass = "playerBidText";
                if (rightPlayer.state === PlayerStates.BID) {
                    rightPlyrBidTextClass = "biddingPlayerText";
                }
                return (
                    <div className="tableArea" style={{ backgroundImage: `url(${bgSrc})` }}>
                        <div className="topPlayerBidArea">
                            <div className="playerBidDiv">
                                <span className="playerBidTextTitle">Bid:</span>
                                <span className={topPlyrBidTextClass}>{topPlyrBidText}</span>
                            </div>
                        </div>
                        <div className="leftPlayerBidArea">
                            <div className="playerBidDiv">
                                <span className="playerBidTextTitle">Bid:</span>
                                <span className={leftPlyrBidTextClass}>{leftPlyrBidText}</span>
                            </div>
                        </div>
                        <div className="kittyDiv">
                            {kittyCards}
                        </div>
                        <div className="rightPlayerBidArea">
                            <div className="playerBidDiv">
                                <span className="playerBidTextTitle">Bid:</span>
                                <span className={rightPlyrBidTextClass}>{rightPlyrBidText}</span>
                            </div>
                        </div>
                        {playerBidArea}
                    </div>
                );
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
