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
            trumpValue: "Black",
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
                        onClick={this.clickedKittyCard}
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

    clickedKittyCard = (cardId) => {
        alert("Clicked kitty card: " + cardId);
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
                        btnHandler: this.props.onDealClick,
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
                        btnHandler: () => this.props.onBidClick(this.state.bidValue),
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
                        btnHandler: this.props.onBidWonClick,
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
                        btnHandler: () => this.props.onNameTrumpClick(this.state.trumpValue),
                    });
                }
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
