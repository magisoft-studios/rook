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
import PlayerActions from "./PlayerActions";

class CardTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameData: this.props.gameData,
            bidValue: "Pass",
            trumpValue: "Black",
        }
    }

    static isStateChanged(gd1, gd2) {
        if (gd1.state !== gd2.state) return true;
        if (gd1.stateText !== gd2.stateText) return true;
        if (gd1.kitty && gd2.kitty) {
            if (gd1.kitty.length !== gd2.kitty.length) return true;
        }
        if (gd1.table.player1 !== gd2.table.player1) return true;
        if (gd1.table.player2 !== gd2.table.player2) return true;
        if (gd1.table.player3 !== gd2.table.player3) return true;
        if (gd1.table.player4 !== gd2.table.player4) return true;

        return false;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (CardTable.isStateChanged(nextProps.gameData, prevState.gameData)) {
            return {
                gameData: nextProps.gameData,
                bidValue: "Pass",
            };
        } else {
            return null;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (CardTable.isStateChanged(prevProps.gameData, this.props.gameData)) {
            this.setState({
                gameData: this.props.gameData,
                bidValue: "Pass",
            });
        }
    }

    createKittyCardArea = (cards, showFace) => {
        let kittyCards = [];
        cards.forEach( (card, index) => {
            let cardKey = "kittyCard" + index;
            let wrapperKey = "kittyCardWrapper" + index;
            let wrapperClass = "kittyCardWrapper";
            let buttonClass = "kittyCardButton";
            let imgClass = "kittyCardImg";
            let imgSrc = showFace ? Cards[card.id] : Cards.cardBack;
            kittyCards.push(
                <div key={wrapperKey} className={wrapperClass}>
                    <KittyCard
                        cardKey={cardKey}
                        cardId={cardKey}
                        buttonClass={buttonClass}
                        onClick={() => this.props.onKittyCardClick(card.id)}
                        imgClass={imgClass}
                        imgSrc={imgSrc} />
                </div>
            );
        });
        return (
            <div className="kittyDiv">
                {kittyCards}
            </div>
        );
    }

    handleBidSelect = (event) => {
        this.setState({
            ...this.state,
            bidValue: event.target.value
        });
    }

    handleTrumpSelect = (event) => {
        this.setState({
            ...this.state,
            trumpValue: event.target.value
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

    setupTableMsgArea(msg) {
        return (
            <div className="tableMsgArea">
                <span className="tableMsgText">{msg}</span>
            </div>
        )
    }

    // Setup the player action area.
    // Options : {
    //              msgText: msgText,
    //              selValue: null,
    //              selHandler: null,
    //              selOptions: null,
    //              btnText: "Call Trump",
    //              btnHandler: this.props.onBidWonClick,
    //
    setupPlayerActionArea(params) {
        let msgSpan = null;
        let select = null;
        let btn = null;

        if (params.msgText != null) {
            msgSpan = <span className="playerActionText">{params.msgText}</span>;
        }

        if (params.selValue != null) {
            select =
                <select
                    className="playerActionSelectInput"
                    id="playerActionSelect"
                    name="playerActionSelect"
                    value={params.selValue}
                    onChange={params.selHandler}>
                    {params.selOptions}
                </select>;
        }

        if (params.btnText != null) {
            btn =
                <button
                    className="playerActionBtn"
                    onClick={params.btnHandler}>
                    {params.btnText}
                </button>;
        }

        return (
            <div className="playerActionArea">
                {msgSpan}
                {select}
                {btn}
            </div>
        );
    }

    setupBidArea(gameData, posn, areaClassName) {
        let player = gameData[posn];
        let bidText = this.calcBidText(player);
        let bidTextClass = "playerBidText";
        if (player.state === PlayerStates.BID) {
            bidTextClass = "biddingPlayerText";
        }
        return (
            <div className={areaClassName}>
                <div className="playerBidDiv">
                    <span className="playerBidTextTitle">Bid:</span>
                    <span className={bidTextClass}>{bidText}</span>
                </div>
            </div>
        );
    }

    setupCardArea = (player, cardId, cardAreaClass) => {
        let cardArea = null;
        if (player.state === PlayerStates.PLAY_CARD) {
            cardArea = (
                <div className={cardAreaClass}>
                    <span className="waitCardText">?</span>
                </div>
            );
        } else {
            cardArea = (
                <div className={cardAreaClass}><TableCard id={cardId} /></div>
            )
        }
        return cardArea;
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
        let gameData = this.state.gameData;
        let gameState = gameData.state;
        let playerPosn = this.context.currentGame.playerPosn;
        let player = gameData[playerPosn];
        let playerState = player.state;
        let playerPosns = this.props.playerPosns;

        let topPlayer = gameData[playerPosns.topPlayerPosn];
        let leftPlayer = gameData[playerPosns.leftPlayerPosn];
        let rightPlayer = gameData[playerPosns.rightPlayerPosn];
        let bottomPlayer = gameData[playerPosns.bottomPlayerPosn];

        let tableMsgArea = null;
        let playerActionArea = null;
        let kittyArea = null;
        let topBidArea = null;
        let leftBidArea = null;
        let rightBidArea = null;
        let bottomBidArea = null;
        let topCardArea = null;
        let leftCardArea = null;
        let rightCardArea = null;
        let bottomCardArea = null;

        switch (gameState) {

            case GameStates.WAIT_FOR_ENTER:
                tableMsgArea = this.setupTableMsgArea(gameData.stateText);
                break;

            case GameStates.DEAL:
                tableMsgArea = this.setupTableMsgArea(gameData.stateText);
                if (playerState === PlayerStates.DEAL) {
                    playerActionArea = this.setupPlayerActionArea({
                        msgText: "Press the button to deal",
                        btnText: "Deal",
                        btnHandler: () => this.props.onPlayerAction(PlayerActions.DEAL),
                    });
                }
                break;

            case GameStates.BIDDING:
                kittyArea = this.createKittyCardArea(gameData.kitty, false);
                topBidArea = this.setupBidArea(gameData, playerPosns.topPlayerPosn, "topPlayerBidArea");
                leftBidArea = this.setupBidArea(gameData, playerPosns.leftPlayerPosn, "leftPlayerBidArea");
                rightBidArea = this.setupBidArea(gameData, playerPosns.rightPlayerPosn, "rightPlayerBidArea");

                if (playerState === PlayerStates.BID) {
                    let bidOptions = this.calcBidOptions(gameData);
                    playerActionArea = this.setupPlayerActionArea({
                        msgText: "Select bid and press the button",
                        selValue: this.state.bidValue,
                        selHandler: this.handleBidSelect,
                        selOptions: bidOptions,
                        btnText: "Enter Bid",
                        btnHandler: () => this.props.onPlayerAction(PlayerActions.BID, this.state.bidValue),
                    });
                } else {
                    bottomBidArea = this.setupBidArea(gameData, playerPosns.bottomPlayerPosn, "bottomPlayerBidArea");
                }
                break;

            case GameStates.BID_WON:
                if (player.state === PlayerStates.BID_WON) {
                    kittyArea = this.createKittyCardArea(gameData.kitty, false);
                    let msgText = "You won the bid at " + this.calcBidText(player);
                    playerActionArea = this.setupPlayerActionArea({
                        msgText: msgText,
                        selValue: null,
                        selHandler: null,
                        selOptions: null,
                        btnText: "Call Trump",
                        btnHandler: () => this.props.onPlayerAction(PlayerActions.BID_WON),
                    });
                } else {
                    // Just show a message saying who won the bid.
                    tableMsgArea = this.setupTableMsgArea(gameData.stateText);
                }
                break;

            case GameStates.NAME_TRUMP:
                if (player.state === PlayerStates.WAIT_FOR_TRUMP) {
                    tableMsgArea = this.setupTableMsgArea(player.stateText);
                } else {
                    kittyArea = this.createKittyCardArea(gameData.kitty, false);
                    let msgText = "Select your trump suit and press the button";
                    let selOptions = [
                        <option key="suitBlack" value="Black">Black</option>,
                        <option key = "suitGreen" value="Green">Green</option>,
                        <option key = "suitRed" value="Red">Red</option>,
                        <option key = "suitYellow" value="Yellow">Yellow</option>
                    ];

                    playerActionArea = this.setupPlayerActionArea({
                        msgText: msgText,
                        selValue: this.state.trumpValue,
                        selHandler: this.handleTrumpSelect,
                        selOptions: selOptions,
                        btnText: "Name Trump",
                        btnHandler: () => this.props.onPlayerAction(PlayerActions.NAME_TRUMP, this.state.trumpValue),
                    });
                }
                break;

            case GameStates.POPULATE_KITTY:
                if (player.state === PlayerStates.WAIT_FOR_KITTY) {
                    tableMsgArea = this.setupTableMsgArea(player.stateText);
                } else {
                    kittyArea = this.createKittyCardArea(gameData.kitty, true);
                    let msgText = "Click a card to move it between the kitty and your hand.";
                    playerActionArea = this.setupPlayerActionArea({
                        msgText: msgText,
                        btnText: "Finished Kitty",
                        btnHandler: () => this.props.onKittyDone(PlayerActions.KITTY_DONE),
                    });
                }
                break;

            case GameStates.WAIT_FOR_CARD:
                let topCardId = gameData.table[playerPosns.topPlayerPosn];
                let leftCardId = gameData.table[playerPosns.leftPlayerPosn];
                let rightCardId = gameData.table[playerPosns.rightPlayerPosn];
                let bottomCardId = gameData.table[playerPosns.bottomPlayerPosn];

                topCardArea = this.setupCardArea(topPlayer, topCardId, 'tableTopCardArea');
                leftCardArea = this.setupCardArea(leftPlayer, leftCardId, 'tableLeftCardArea');
                rightCardArea = this.setupCardArea(rightPlayer, rightCardId, 'tableRightCardArea');
                bottomCardArea = this.setupCardArea(bottomPlayer, bottomCardId, 'tableBottomCardArea');

                return (
                    <div className="tableArea">
                        {topCardArea}
                        {leftCardArea}
                        {rightCardArea}
                        {bottomCardArea}
                    </div>
                );
                break;

            default:
                break;
        }

        return (
            <div className="tableArea">
                {tableMsgArea}
                {kittyArea}
                {topBidArea}
                {leftBidArea}
                {rightBidArea}
                {bottomBidArea}
                {playerActionArea}
                {topCardArea}
                {leftCardArea}
                {rightCardArea}
                {bottomCardArea}
            </div>
        )
    }

}

CardTable.contextType = AppContext;

export default CardTable;
