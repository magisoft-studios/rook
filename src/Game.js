import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cards from './Cards'
import players from './Players'
import GameInfoArea from './GameInfoArea';
import Card from './Card';
import PlayerHand from './PlayerHand';
import OpponentCard from './OpponentCard';
import CardTable from './CardTable';
import {AppContext} from "./ContextLib";
import PlayerStates from './PlayerStates';
import GameStates from './GameStates';
import PlayerActions from "./PlayerActions";

const REFRESH_RATE = 5000;

class Game extends Component {
    constructor(props) {
        super(props);
        this.playerHandRef = React.createRef();
        this.cardTableRef = React.createRef();
        this.posns = {
            bottomPlayerId: "",
            leftPlayerId: "",
            topPlayerId: "",
            rightPlayerId: "",
        };
        this.state = {
            gameId: props.gameId,
            playerPosn: props.playerPosn,
            gameData: props.gameData
        }
        this.calcPlayerPosns(props.playerPosn);
        this.updateTimerId = null;
    }

    componentDidMount = async () => {
        await this.checkStatus();
        this.updateTimerId = setInterval(async () => this.checkStatus(), REFRESH_RATE);
    }

    componentWillUnmount() {
        clearInterval(this.updateTimerId);
    }

    checkStatus = async () => {
        await this.getGameData();
    }

    setupRequestOptions = (bodyProps) => {
        return {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: this.context.id,
                ...bodyProps,
            }),
        };
    }

    sendRequest = async(cmd, options) => {
        try {
            let url = "/rook/" + cmd;
            const response = await fetch(url, options);
            if (!response.ok) {
                throw Error(response.statusText);
            } else {
                const jsonResp = await response.json();
                let status = jsonResp.rookResponse.status;
                if (status === "SUCCESS") {
                    this.setState({
                        ...this.state,
                        gameData: jsonResp.rookResponse.gameData
                    });
                } else {
                    alert(jsonResp.rookResponse.errorMsg);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    getGameData = async () => {
        let requestOptions = this.setupRequestOptions();
        this.sendRequest("getGameData", requestOptions);
    }

    handlePlayerAction = async(action, value) => {
        let requestOptions = this.setupRequestOptions({
            action: action,
            value: value ? value : "NA",
        });
        this.sendRequest("playerAction", requestOptions);
    }

    handleKittyCardClick = async (cardId) => {
        if (this.state.gameData.state === GameStates.POPULATE_KITTY) {
            let requestOptions = this.setupRequestOptions({cardId: cardId});
            this.sendRequest("takeKittyCard", requestOptions);
        }
    }

    handleCardClick = async (cardId) => {
        let requestOptions = this.setupRequestOptions({cardId: cardId});
        if (this.state.gameData.state === GameStates.POPULATE_KITTY) {
            this.sendRequest("putKittyCard", requestOptions);
        } else if (this.state.gameData.state === GameStates.WAIT_FOR_CARD) {
            this.sendRequest("playCard", requestOptions);
        }
    }

    handleKittyDone = (event) => {
        let gameData = this.state.gameData;
        let playerPosn = this.context.currentGame.playerPosn;
        let player = gameData[playerPosn];
        if (gameData.state === GameStates.POPULATE_KITTY) {
            if (player.state === PlayerStates.SETUP_KITTY) {
                let errMsg = "";
                if (gameData.kitty.length === 5) {
                    gameData.kitty.forEach( (card) => {
                        if (card.pointValue > 0) {
                            errMsg = "Oops, kitty must not contain any point cards";
                        }
                    });
                } else {
                    errMsg = "Oops, kitty must contain 5 cards!";
                }

                if (errMsg.length === 0) {
                    let requestOptions = this.setupRequestOptions({
                        action: PlayerActions.KITTY_DONE,
                        value: "NA",
                    });
                    this.sendRequest("playerAction", requestOptions);
                } else {
                    this.showErrorToast(errMsg);
                }
            }
        }
    }


    calcPlayerPosns(playerPosn) {
        switch (playerPosn) {
            case "player1":
                this.posns.bottomPlayerPosn = "player1";
                this.posns.leftPlayerPosn = "player2";
                this.posns.topPlayerPosn = "player3";
                this.posns.rightPlayerPosn = "player4";
                break;
            case "player2":
                this.posns.bottomPlayerPosn = "player2";
                this.posns.leftPlayerPosn = "player3";
                this.posns.topPlayerPosn = "player4";
                this.posns.rightPlayerPosn = "player1";
                break;
            case "player3":
                this.posns.bottomPlayerPosn = "player3";
                this.posns.leftPlayerPosn = "player4";
                this.posns.topPlayerPosn = "player1";
                this.posns.rightPlayerPosn = "player2";
                break;
            case "player4":
                this.posns.bottomPlayerPosn = "player4";
                this.posns.leftPlayerPosn = "player1";
                this.posns.topPlayerPosn = "player2";
                this.posns.rightPlayerPosn = "player3";
                break;
            default:
                this.posns.bottomPlayerPosn = "player1";
                this.posns.leftPlayerPosn = "player2";
                this.posns.topPlayerPosn = "player3";
                this.posns.rightPlayerPosn = "player4";
                break;
        }
    }

    showErrorToast = (msg) => {
        toast.error(msg, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    createVertOpponentCard(player, index) {
        let cardKey = player + index;
        let wrapperClass = "oppCardVertWrapper";
        let imgClass = "oppCardVert";
        let imgSrc = cards.cardBack;
        return (
            <OpponentCard
                key={cardKey}
                cardKey={cardKey}
                wrapperClass={wrapperClass}
                imgClass={imgClass}
                imgSrc={imgSrc} />
        );
    }

    createHorizOpponentCard(player, index) {
        let cardKey = player + index;
        let wrapperClass = "oppCardHorizWrapper";
        let imgClass = "oppCardHoriz";
        let imgSrc = cards.cardBackHoriz;
        return (
            <OpponentCard
                key={cardKey}
                cardKey={cardKey}
                wrapperClass={wrapperClass}
                imgClass={imgClass}
                imgSrc={imgSrc} />
        );
    }

    getTeamId(playerId) {
        let teamId = "team1";
        if (playerId === "player2" || playerId === "player4") {
            teamId = "team2"
        }
        return teamId;
    }

    getImageClass(player) {
        let imageClass = "playerImage";
        if ((player.state === PlayerStates.DEAL) ||
            (player.state === PlayerStates.BID) ||
            (player.state === PlayerStates.PLAY_CARD))
        {
            imageClass = "selectedPlayerImage";
        }
        return imageClass;
    }

    // NOTE: There is currently no way to prevent an "empty" render before the first data fetch
    //
    render() {
        console.log("Game: render START");

        let gameData = this.state.gameData;

        let topPlayer = gameData[this.posns.topPlayerPosn];
        let leftPlayer = gameData[this.posns.leftPlayerPosn];
        let rightPlayer = gameData[this.posns.rightPlayerPosn];
        let bottomPlayer = gameData[this.posns.bottomPlayerPosn];

        let topPlayerImg = topPlayer.imgName;
        let leftPlayerImg = leftPlayer.imgName;
        let rightPlayerImg = rightPlayer.imgName;
        let bottomPlayerImg = bottomPlayer.imgName;

        let topPlayerImgClass = "playerImage";
        let leftPlayerImgClass = "playerImage";
        let rightPlayerImgClass = "playerImage";
        let bottomPlayerImgClass = this.getImageClass(bottomPlayer);

        let topPlayerCardCmpnts = [];
        let leftPlayerCardCmpnts = [];
        let rightPlayerCardCmpnts = [];
        let bottomPlayerCards = [];

        for (let i = 0; i < topPlayer.numCards; i++) {
            leftPlayerCardCmpnts.push(this.createHorizOpponentCard(topPlayer.name, i));
        }

        for (let i = 0; i < leftPlayer.numCards; i++) {
            topPlayerCardCmpnts.push(this.createVertOpponentCard(leftPlayer.name, i));
        }

        for (let i = 0; i < rightPlayer.numCards; i++) {
            rightPlayerCardCmpnts.push(this.createHorizOpponentCard(rightPlayer.name, i));
        }

        let cards = bottomPlayer.cards;
        if (cards) {
            for (let i = 0; i < cards.length; i++) {
                let card = cards[i];
                bottomPlayerCards.push(new Card(card.id, card.name, card.value, card.pointValue, card.suit));
                //bottomPlayerCards.push(new Card("card14Yellow", "card14Yellow", 14, 10, "yellow"));
            }
        }

        return (
            <div className="gameView">
                <div className="gameArea">
                    <GameInfoArea gameData={this.state.gameData} />
                    <div className="topPlayerArea">
                        <div className="playerImageDiv">
                            <img className={topPlayerImgClass} src={players[topPlayerImg]} alt="Player 1"></img>
                        </div>
                        <div className="topPlayerCardArea">
                            {topPlayerCardCmpnts}
                        </div>
                    </div>
                    <div className="leftPlayerArea">
                        <div className="leftPlayerAreaImageDiv">
                            <div className="playerImageDiv">
                                <img className={leftPlayerImgClass} src={players[leftPlayerImg]} alt="Player 2"></img>
                            </div>
                        </div>
                        <div className="leftPlayerCardArea">
                            {leftPlayerCardCmpnts}
                        </div>
                    </div>
                    <CardTable
                        ref={this.cardTableRef}
                        gameData={this.state.gameData}
                        playerPosns={this.posns}
                        onPlayerAction={this.handlePlayerAction}
                        onKittyCardClick={this.handleKittyCardClick}
                        onKittyDone={this.handleKittyDone}>
                    </CardTable>
                    <div className="rightPlayerArea">
                        <div className="righttPlayerAreaImageDiv">
                            <div className="playerImageDiv">
                                <img className={rightPlayerImgClass} src={players[rightPlayerImg]} alt="Player 3"></img>
                            </div>
                        </div>
                        <div className="rightPlayerCardArea">
                            {rightPlayerCardCmpnts}
                        </div>
                    </div>
                    <div className="bottomPlayerArea">
                        <div className="playerImageDiv">
                            <img className={bottomPlayerImgClass} src={players[bottomPlayerImg]} alt="Player 4"></img>
                        </div>
                        <div className="bottomPlayerCardArea">
                            <PlayerHand
                                ref={this.playerHandRef}
                                cardList={bottomPlayerCards}
                                onClick={this.handleCardClick} />
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        );
    }
}

Game.contextType = AppContext;

export default Game;
