import React, { Component } from 'react'
import TableCard from './TableCard';
import PlayerStates from './PlayerStates';
import GameStates from './GameStates';
import {AppContext} from "./ContextLib";
import Cards from "./Cards";
import KittyCard from "./KittyCard";
import PlayerActions from "./PlayerActions";
import MyButton from "./MyButton";
import './css/CardTable.scss';

class CardTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //gameData: this.props.gameData,
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

    componentDidUpdate(prevProps, prevState) {
        if (CardTable.isStateChanged(prevProps.gameData, this.props.gameData)) {
            this.setState({
                gameData: this.props.gameData,
                bidValue: CardTable.calcDefaultBidValue(this.props.gameData),
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

    static calcDefaultBidValue = (gameData) => {
        let defaultBid = "";
        let minBid = 70;
        let maxBid = 180;

        let currentHighBid = gameData.highBid;
        if (currentHighBid === maxBid) {
            defaultBid = "Pass";
        } else {
            let nextBid = (currentHighBid >= minBid) ? currentHighBid + 5 : minBid;

            // Only include PASS as an option if all other players have not PASSED.
            let passCntr = 0;
            if (gameData.player1.bid < 0) passCntr++;
            if (gameData.player2.bid < 0) passCntr++;
            if (gameData.player3.bid < 0) passCntr++;
            if (gameData.player4.bid < 0) passCntr++;
            if (passCntr < 3) {
                defaultBid = "Pass";
            } else {
                defaultBid = nextBid.toString();
            }
        }

        return defaultBid;
    }

    calcBidOptions = (gameData) => {
        let bidOptions = [];

        let highBid = gameData.highBid;
        let minBid = 70;
        let nextBid = (highBid >= minBid) ? highBid + 5 : minBid;
        let maxBid = 180;

        // Only include PASS as an option if all other players have not PASSED.
        let passCntr = 0;
        if (gameData.player1.bid < 0) passCntr++;
        if (gameData.player2.bid < 0) passCntr++;
        if (gameData.player3.bid < 0) passCntr++;
        if (gameData.player4.bid < 0) passCntr++;
        if (passCntr < 3) {
            bidOptions.push(
                <option key="Pass" value="Pass">Pass</option>
            );
        }

        for (let i = nextBid; i <= maxBid; i+=5) {
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

    setupTableMsgArea(msgs) {
        let msgSpans = [];
        for (let i = 0; i < msgs.length; i++) {
            msgSpans.push(<span key={"tableMsg"+i} className="tableMsgText">{msgs[i]}</span>);
        }

        return (
            <div className="tableMsgArea">
                {msgSpans}
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
        let msg1Span = null;
        let msg2Span = null;
        let select = null;
        let btn = null;

        if (params.msg1Text != null) {
            msg1Span = <span className="playerActionText">{params.msg1Text}</span>;
        }

        if (params.msg2Text != null) {
            msg2Span = <span className="playerActionText">{params.msg2Text}</span>;
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
                <MyButton
                    btnClass="playerActionBtn"
                    btnText={params.btnText}
                    onClick={params.btnHandler}
                    onClickValue={params.btnValue}>
                </MyButton>
        }

        let actionAreaClass = params.areaClass ? params.areaClass : "playerActionArea";

        return (
            <div className={actionAreaClass}>
                {msg1Span}
                {msg2Span}
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
                    <span className="playerWaitCardText">?</span>
                </div>
            );
        } else if (cardId != null) {
            cardArea = (
                <div className={cardAreaClass}><TableCard id={cardId} /></div>
            )
        } else {
            cardArea = (
                <div className={cardAreaClass}>
                    <span className="waitCardText">?</span>
                </div>
            );
        }
        return cardArea;
    }

    render() {
        let gameData = this.props.gameData;
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
                tableMsgArea = this.setupTableMsgArea([gameData.stateText]);
                break;

            case GameStates.INIT_STREAM:
                tableMsgArea = this.setupTableMsgArea([gameData.stateText]);
                break;

            case GameStates.INIT_CONN:
                tableMsgArea = this.setupTableMsgArea([gameData.stateText]);
                break;

            case GameStates.DEAL:
                if (playerState === PlayerStates.DEAL) {
                    playerActionArea = this.setupPlayerActionArea({
                        msg1Text: "Press the button to deal",
                        btnText: "Deal",
                        btnHandler: this.props.onPlayerAction,
                        btnValue: {action: PlayerActions.DEAL},
                    });
                } else {
                    tableMsgArea = this.setupTableMsgArea([gameData.stateText]);
                }
                break;

            case GameStates.BIDDING:
                topBidArea = this.setupBidArea(gameData, playerPosns.topPlayerPosn, "topPlayerBidArea");
                leftBidArea = this.setupBidArea(gameData, playerPosns.leftPlayerPosn, "leftPlayerBidArea");
                rightBidArea = this.setupBidArea(gameData, playerPosns.rightPlayerPosn, "rightPlayerBidArea");

                if (playerState === PlayerStates.BID) {
                    let bidOptions = this.calcBidOptions(gameData);
                    playerActionArea = this.setupPlayerActionArea({
                        selValue: this.state.bidValue,
                        selHandler: this.handleBidSelect,
                        selOptions: bidOptions,
                        btnText: "Enter Bid",
                        btnHandler: this.props.onPlayerAction,
                        btnValue: {action: PlayerActions.BID, value: this.state.bidValue},
                    });
                } else {
                    kittyArea = this.createKittyCardArea(gameData.kitty, false);
                    bottomBidArea = this.setupBidArea(gameData, playerPosns.bottomPlayerPosn, "bottomPlayerBidArea");
                }
                break;

            case GameStates.BID_WON:
                if (player.state === PlayerStates.BID_WON) {
                    let msgText = "You won the bid at " + this.calcBidText(player);
                    playerActionArea = this.setupPlayerActionArea({
                        msg1Text: msgText,
                        selValue: null,
                        selHandler: null,
                        selOptions: null,
                        btnText: "Call Trump",
                        btnHandler: this.props.onPlayerAction,
                        btnValue: {action: PlayerActions.BID_WON},
                    });
                } else {
                    // Just show a message saying who won the bid.
                    tableMsgArea = this.setupTableMsgArea([gameData.stateText]);
                }
                break;

            case GameStates.NAME_TRUMP:
                if (player.state === PlayerStates.WAIT_FOR_TRUMP) {
                    tableMsgArea = this.setupTableMsgArea([player.stateText]);
                } else {
                    let msgText = "Select your trump suit and press the button";
                    let selOptions = [
                        <option key="suitBlack" value="Black">Black</option>,
                        <option key = "suitGreen" value="Green">Green</option>,
                        <option key = "suitRed" value="Red">Red</option>,
                        <option key = "suitYellow" value="Yellow">Yellow</option>
                    ];

                    playerActionArea = this.setupPlayerActionArea({
                        msg1Text: msgText,
                        selValue: this.state.trumpValue,
                        selHandler: this.handleTrumpSelect,
                        selOptions: selOptions,
                        btnText: "Name Trump",
                        btnHandler: this.props.onPlayerAction,
                        btnValue: {action: PlayerActions.NAME_TRUMP, value: this.state.trumpValue},
                    });
                }
                break;

            case GameStates.POPULATE_KITTY:
                if (player.state === PlayerStates.WAIT_FOR_KITTY) {
                    tableMsgArea = this.setupTableMsgArea([player.stateText]);
                } else {
                    kittyArea = this.createKittyCardArea(gameData.kitty, true);
                    let msgText = "Click a card to move between the kitty and hand.";
                    playerActionArea = this.setupPlayerActionArea({
                        areaClass: "kittyActionArea",
                        msg1Text: msgText,
                        btnText: "Finished Kitty",
                        btnHandler: this.props.onKittyDone,
                        btnValue: {action: PlayerActions.KITTY_DONE},
                    });
                }
                break;

            case GameStates.WAIT_FOR_CARD: {
                let topCardId = gameData.table[playerPosns.topPlayerPosn];
                let leftCardId = gameData.table[playerPosns.leftPlayerPosn];
                let rightCardId = gameData.table[playerPosns.rightPlayerPosn];
                let bottomCardId = gameData.table[playerPosns.bottomPlayerPosn];

                topCardArea = this.setupCardArea(topPlayer, topCardId, 'tableTopCardArea');
                leftCardArea = this.setupCardArea(leftPlayer, leftCardId, 'tableLeftCardArea');
                rightCardArea = this.setupCardArea(rightPlayer, rightCardId, 'tableRightCardArea');
                bottomCardArea = this.setupCardArea(bottomPlayer, bottomCardId, 'tableBottomCardArea');
                break;
            }

            case GameStates.TAKE_TRICK: {
                let topCardId = gameData.table[playerPosns.topPlayerPosn];
                let leftCardId = gameData.table[playerPosns.leftPlayerPosn];
                let rightCardId = gameData.table[playerPosns.rightPlayerPosn];
                let bottomCardId = gameData.table[playerPosns.bottomPlayerPosn];

                topCardArea = this.setupCardArea(topPlayer, topCardId, 'tableTopCardArea');
                leftCardArea = this.setupCardArea(leftPlayer, leftCardId, 'tableLeftCardArea');
                rightCardArea = this.setupCardArea(rightPlayer, rightCardId, 'tableRightCardArea');
                bottomCardArea = this.setupCardArea(bottomPlayer, bottomCardId, 'tableBottomCardArea');

                if (player.state === PlayerStates.TRICK_WON) {
                    playerActionArea = this.setupPlayerActionArea({
                        btnText: "Take Trick",
                        btnHandler: this.props.onPlayerAction,
                        btnValue: {action: PlayerActions.TAKE_TRICK},
                    });
                } else {
                    let trickWinner = gameData[gameData.trick.winnerPosn];
                    let msg = trickWinner.name + " wins";
                    tableMsgArea = this.setupTableMsgArea([msg]);
                }
                break;
            }

            case GameStates.END_OF_HAND: {
                let team1Msg = "Team 1 scored " + gameData.team1.handScore + " points!";
                if (gameData.highBidTeamId === "team1") {
                    if (gameData.team1.handScore < gameData.highBid) {
                        team1Msg = "Team 1 lost " + gameData.highBid + " points";
                    }
                }

                let team2Msg = "Team 2 scored " + gameData.team2.handScore + " points!";
                if (gameData.highBidTeamId === "team2") {
                    if (gameData.team2.handScore < gameData.highBid) {
                        team2Msg = "Team 2 lost " + gameData.highBid + " points";
                    }
                }

                if (player.state === PlayerStates.END_HAND) {
                    playerActionArea = this.setupPlayerActionArea({
                        msg1Text: team1Msg,
                        msg2Text: team2Msg,
                        btnText: "End Hand",
                        btnHandler: this.props.onPlayerAction,
                        btnValue: {action: PlayerActions.END_HAND},
                    });
                } else {
                    let msgs = [team1Msg,team2Msg];
                    tableMsgArea = this.setupTableMsgArea(msgs);
                }
                break;
            }

            default:
                break;
        }

        let bg = `${process.env.PUBLIC_URL}/card-table.png`;
        return (
            <div className="tableArea" style={{backgroundImage: `url(${bg})`}}>
                {tableMsgArea}
                {kittyArea}
                {topBidArea}
                {leftBidArea}
                {rightBidArea}
                {bottomBidArea}
                {topCardArea}
                {leftCardArea}
                {rightCardArea}
                {bottomCardArea}
                {playerActionArea}
            </div>
        )
    }

}

CardTable.contextType = AppContext;

export default CardTable;
