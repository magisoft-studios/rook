import React, { Component } from 'react'
import TableCard from './TableCard';
import ElementsPlayerStates from './shared/ElementsPlayerStates.mjs';
import AppContext from "./ContextLib";
import CommonCards from './CommonCards';
import RookCards from './RookCards';
import ElementsCards from './ElementsCards';
import KittyCard from "./KittyCard";
import PlayerActions from "./PlayerActions";
import MyButton from "./MyButton";
import './css/CardTable.scss';

class CardTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bidValue: "Pass",
            trumpValue: "Red",
        }
        if (props.gameData.desc.name === "Elements") {
            this.cardDeck = ElementsCards;
        } else {
            this.cardDeck = RookCards;
        }
    }

    static isStateChanged(gd1, gd2) {
        if (gd1.state.value !== gd2.state.value) return true;
        if (gd1.state.text !== gd2.state.text) return true;
        if (gd1.kitty && gd2.kitty) {
            if (gd1.kitty.length !== gd2.kitty.length) return true;
        }
        if (gd1.table.player1 !== gd2.table.player1) return true;
        if (gd1.table.player2 !== gd2.table.player2) return true;
        if (gd1.table.player3 !== gd2.table.player3) return true;
        if (gd1.table.player4 !== gd2.table.player4) return true;

        if ((gd1.player1) && (gd2.player1)) {
            if (gd1.player1.state !== gd2.player1.state) return true;
        }
        if ((gd1.player2) && (gd2.player2)) {
            if (gd1.player2.state !== gd2.player2.state) return true;
        }
        if ((gd1.player3) && (gd2.player3)) {
            if (gd1.player3.state !== gd2.player3.state) return true;
        }
        if ((gd1.player4) && (gd2.player4)) {
            if (gd1.player4.state !== gd2.player4.state) return true;
        }

        return false;
    }

    componentDidUpdate(prevProps, prevState) {
        if (CardTable.isStateChanged(prevProps.gameData, this.props.gameData)) {
            if (this.props.gameData.state.str === 'BID') {
                this.setState({
                    bidValue: CardTable.calcDefaultBidValue(this.props.gameData),
                });
            } else if (this.props.gameData.state.str === 'NAME_TRUMP') {
                let defaultTrumpValue = "Air";
                if (this.props.gameData.desc.name === "Rook") {
                    defaultTrumpValue = "Yellow";
                }
                this.setState( {
                    trumpValue: defaultTrumpValue
                });
            }
        }
    }

    createKittyCardArea = (gameData, showFace) => {
        let cards = gameData.kitty;
        let kittyCards = [];
        cards.forEach( (card, index) => {
            let cardKey = "kittyCard" + index;
            let wrapperKey = "kittyCardWrapper" + index;
            let wrapperClass = "kittyCardWrapper";
            let buttonClass = "kittyCardButton";
            let imgClass = "kittyCardImg";
            let cardId = card.id;
            if (cardId === 'cardElemental') {
                if (gameData.trumpSuit && (gameData.trumpSuit.length > 0)) {
                    cardId = 'card' + gameData.trumpSuit + 'Elemental';
                }
            }
            let imgSrc = showFace ? this.cardDeck[cardId] : CommonCards.cardBack;
            kittyCards.push(
                <div key={wrapperKey} className={wrapperClass}>
                    <KittyCard
                        cardKey={cardKey}
                        cardId={card.id}
                        buttonClass={buttonClass}
                        onClick={this.props.onKittyCardClick}
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
        let minBid = gameData.minBid;
        let maxBid = gameData.maxBid;

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
        let minBid = gameData.minBid;
        let nextBid = (highBid >= minBid) ? highBid + 5 : minBid;
        let maxBid = gameData.maxBid;

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
        if (player.state.value === ElementsPlayerStates.BID) {
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
        if (player.state.value === ElementsPlayerStates.BID) {
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

    setupOtherCardArea = (gameData, player, cardId, waitCardAreaClass, cardAreaMsgClass) => {
        let cardArea = null;
        if (player.state.value === ElementsPlayerStates.PLAY_CARD) {
            cardArea = (
                <div className={cardAreaMsgClass}>
                    <span className="playerPlayCardText">Waiting for {player.name}</span>
                </div>
            );
        } else if (cardId != null) {
            if (cardId === 'cardElemental') {
                if (gameData.trumpSuit && (gameData.trumpSuit.length > 0)) {
                    cardId = 'card' + gameData.trumpSuit + 'Elemental';
                }
            }
            let imgSrc = this.cardDeck[cardId];
            cardArea = (
                <div className={waitCardAreaClass}><TableCard imgSrc={imgSrc}/></div>
            )
        } else {
            cardArea = (
                <div className={waitCardAreaClass}>
                    <span className="waitCardText">?</span>
                </div>
            );
        }
        return cardArea;
    }

    setupMyCardArea = (gameData, player, cardId, cardAreaClass) => {
        let cardArea = null;
        if (cardId != null) {
            if (cardId === 'cardElemental') {
                if (gameData.trumpSuit && (gameData.trumpSuit.length > 0)) {
                    cardId = 'card' + gameData.trumpSuit + 'Elemental';
                }
            }
            let imgSrc = this.cardDeck[cardId];
            cardArea = (
                <div className={cardAreaClass}><TableCard imgSrc={imgSrc}/></div>
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
        let playerPosn = this.context.session.currentGame.playerPosn;
        let player = gameData[playerPosn];
        let playerState = player ? player.state : "";
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

        switch (gameState.str) {
            case 'WAIT_FOR_ENTER':
                tableMsgArea = this.setupTableMsgArea([gameData.stateDisplayText]);
                break;

            case 'INIT_STREAM':
                tableMsgArea = this.setupTableMsgArea([gameData.stateDisplayText]);
                break;

            case 'INIT_CONN':
                tableMsgArea = this.setupTableMsgArea([gameData.stateDisplayText]);
                break;

            case 'DEAL':
                if (playerState.value === ElementsPlayerStates.DEAL) {
                    playerActionArea = this.setupPlayerActionArea({
                        msg1Text: "Press the button to deal",
                        btnText: "Deal",
                        btnHandler: this.props.onPlayerAction,
                        btnValue: {action: PlayerActions.DEAL},
                    });
                } else {
                    tableMsgArea = this.setupTableMsgArea([gameData.stateDisplayText]);
                }
                break;

            case 'BID':
                kittyArea = this.createKittyCardArea(gameData, false);
                topBidArea = this.setupBidArea(gameData, playerPosns.topPlayerPosn, "topPlayerBidArea");
                leftBidArea = this.setupBidArea(gameData, playerPosns.leftPlayerPosn, "leftPlayerBidArea");
                rightBidArea = this.setupBidArea(gameData, playerPosns.rightPlayerPosn, "rightPlayerBidArea");

                if (playerState.value === ElementsPlayerStates.BID) {
                    let bidOptions = this.calcBidOptions(gameData);
                    playerActionArea = this.setupPlayerActionArea({
                        msg1Text: "Press down-arrow to choose bid",
                        selValue: this.state.bidValue,
                        selHandler: this.handleBidSelect,
                        selOptions: bidOptions,
                        btnText: "Enter Bid",
                        btnHandler: this.props.onPlayerAction,
                        btnValue: {action: PlayerActions.BID, value: this.state.bidValue},
                    });
                } else {
                    bottomBidArea = this.setupBidArea(gameData, playerPosns.bottomPlayerPosn, "bottomPlayerBidArea");
                    tableMsgArea = this.setupTableMsgArea([gameData.stateDisplayText]);
                }
                break;

            case 'BID_WON':
                kittyArea = this.createKittyCardArea(gameData, false);
                if (playerState.value === ElementsPlayerStates.BID_WON) {
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
                    tableMsgArea = this.setupTableMsgArea([gameData.stateDisplayText]);
                }
                break;

            case 'NAME_TRUMP':
                kittyArea = this.createKittyCardArea(gameData, false);
                if (playerState.value === ElementsPlayerStates.WAIT_FOR_TRUMP) {
                    tableMsgArea = this.setupTableMsgArea([player.stateDisplayText]);
                } else {
                    let msgText = "Press the down-arrow to choose your trump suit";
                    let selOptions = [
                        <option value="Black">Black</option>,
                        <option value="Green">Green</option>,
                        <option value="Red">Red</option>,
                        <option value="Yellow">Yellow</option>
                    ];
                    if (this.props.gameData.desc.name === "Elements") {
                        selOptions = [
                            <option value="Air">Air</option>,
                            <option value="Earth">Earth</option>,
                            <option value="Fire">Fire</option>,
                            <option value="Water">Water</option>
                        ];
                    }

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

            case 'SETUP_KITTY':
                if (playerState.value === ElementsPlayerStates.WAIT_FOR_KITTY) {
                    kittyArea = this.createKittyCardArea(gameData, false);
                    tableMsgArea = this.setupTableMsgArea([player.stateDisplayText]);
                } else {
                    kittyArea = this.createKittyCardArea(gameData, true);
                    let msgText = "Click card to move between kitty and hand.";
                    playerActionArea = this.setupPlayerActionArea({
                        areaClass: "kittyActionArea",
                        msg1Text: msgText,
                        btnText: "Finished Kitty",
                        btnHandler: this.props.onKittyDone,
                        btnValue: {action: PlayerActions.KITTY_DONE},
                    });
                }
                break;

            case 'PLAY_CARD': {
                let topCardId = gameData.table[playerPosns.topPlayerPosn];
                let leftCardId = gameData.table[playerPosns.leftPlayerPosn];
                let rightCardId = gameData.table[playerPosns.rightPlayerPosn];
                let bottomCardId = gameData.table[playerPosns.bottomPlayerPosn];

                topCardArea = this.setupOtherCardArea(gameData, topPlayer, topCardId, 'tableTopCardArea', 'tableTopMsgArea');
                leftCardArea = this.setupOtherCardArea(gameData, leftPlayer, leftCardId, 'tableLeftCardArea', 'tableLeftMsgArea');
                rightCardArea = this.setupOtherCardArea(gameData, rightPlayer, rightCardId, 'tableRightCardArea', 'tableRightMsgArea');

                if (playerState.value === ElementsPlayerStates.PLAY_CARD) {
                    let msgText = "Click on a card to play";
                    playerActionArea = this.setupPlayerActionArea({
                        areaClass: "kittyActionArea",
                        msg1Text: msgText,
                    });
                } else {
                    bottomCardArea = this.setupMyCardArea(gameData, bottomPlayer, bottomCardId, 'tableBottomCardArea');
                }

                break;
            }

            case 'TAKE_TRICK': {
                let topCardId = gameData.table[playerPosns.topPlayerPosn];
                let leftCardId = gameData.table[playerPosns.leftPlayerPosn];
                let rightCardId = gameData.table[playerPosns.rightPlayerPosn];
                let bottomCardId = gameData.table[playerPosns.bottomPlayerPosn];

                topCardArea = this.setupOtherCardArea(gameData, topPlayer, topCardId, 'tableTopCardArea');
                leftCardArea = this.setupOtherCardArea(gameData, leftPlayer, leftCardId, 'tableLeftCardArea');
                rightCardArea = this.setupOtherCardArea(gameData, rightPlayer, rightCardId, 'tableRightCardArea');
                bottomCardArea = this.setupMyCardArea(gameData, bottomPlayer, bottomCardId, 'tableBottomCardArea');

                if (playerState.value === ElementsPlayerStates.TAKE_TRICK) {
                    playerActionArea = this.setupPlayerActionArea({
                        btnText: "Take Trick",
                        btnHandler: this.props.onPlayerAction,
                        btnValue: {action: PlayerActions.TAKE_TRICK},
                    });
                } else {
                    tableMsgArea = this.setupTableMsgArea([gameData.stateDisplayText]);
                }
                break;
            }

            case 'END_OF_HAND': {
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

                let endHandPlayer = null;
                if (topPlayer.state.value === ElementsPlayerStates.END_HAND) {
                    endHandPlayer = topPlayer;
                } else if (leftPlayer.state.value === ElementsPlayerStates.END_HAND) {
                    endHandPlayer = leftPlayer;
                } else if (rightPlayer.state.value === ElementsPlayerStates.END_HAND) {
                    endHandPlayer = rightPlayer;
                }

                if (playerState.value === ElementsPlayerStates.END_HAND) {
                    playerActionArea = this.setupPlayerActionArea({
                        msg1Text: team1Msg,
                        msg2Text: team2Msg,
                        btnText: "End Hand",
                        btnHandler: this.props.onPlayerAction,
                        btnValue: {action: PlayerActions.END_HAND},
                    });
                } else {
                    let endHandMsg = `Waiting for ${endHandPlayer.name} to end hand`;
                    let msgs = [team1Msg,team2Msg,endHandMsg];
                    tableMsgArea = this.setupTableMsgArea(msgs);
                }
                break;
            }

            case 'END_OF_GAME': {
                tableMsgArea = this.setupTableMsgArea([gameData.stateDisplayText]);
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
