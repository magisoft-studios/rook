import StateData from './StateData.mjs';
import PlayerStates from "./PlayerStates.mjs";

class ElementsPlayerStates extends PlayerStates {
    static DEAL = 7;   // It's this player's turn to deal
    static WAIT_FOR_DEAL = 8;   // Waiting for another player to deal
    static BID = 9;   // It's this player's turn to bid
    static WAIT_FOR_BID = 10;   // Waiting for other player's to bid
    static PASSED = 11;   // This player has passed and is done bidding
    static BID_WON = 12;   // This player won the bidding
    static NAME_TRUMP = 13;   // This player is naming trump
    static WAIT_FOR_TRUMP = 14;   // Waiting for another player to name trump
    static SETUP_KITTY = 15;   // This player is taking kitty
    static WAIT_FOR_KITTY = 16;   // Waiting for another player to fill the kitty
    static PLAY_CARD = 17;   // It is this player's turn to play a card
    static WAIT_FOR_CARD = 18;   // Waiting for another player to play a card
    static TAKE_TRICK = 19;   // This player has won the trick
    static WAIT_FOR_TAKE_TRICK = 20;   // Waiting for the trick winner to take the trick
    static END_HAND = 21;   // End of Hand - Announce score, then go back to DEAL
    static WAIT_FOR_END_HAND = 22;   // Wait for other player to end the hand

    constructor() {
        super();
        this.addState(new StateData({
            value: ElementsPlayerStates.DEAL,
            str: 'DEAL',
            text: 'Waiting for $1 to deal'
        }));
        this.addState(new StateData({
            value: ElementsPlayerStates.WAIT_FOR_DEAL,
            str: 'WAIT_FOR_DEAL',
            text: 'Waiting for $1 to deal'
        }));
        this.addState(new StateData({
            value: ElementsPlayerStates.BID,
            str: 'BID',
            text: "It's your bid"
        }));
        this.addState(new StateData({
            value: ElementsPlayerStates.WAIT_FOR_BID,
            str: 'WAIT_FOR_BID',
            text: 'Waiting for $1 to bid'
        }));
        this.addState(new StateData({
            value: ElementsPlayerStates.PASSED,
            str: 'PASSED',
            text: 'Passed'
        }));
        this.addState(new StateData({
            value: ElementsPlayerStates.BID_WON,
            str: 'BID_WON',
            text: '$1 has won the bidding'
        }));
        this.addState(new StateData({
            value: ElementsPlayerStates.NAME_TRUMP,
            str: 'NAME_TRUMP',
            text: '$1  is naming trump'
        }));
        this.addState(new StateData({
            value: ElementsPlayerStates.WAIT_FOR_TRUMP,
            str: 'NAME_TRUMP',
            text: 'Waiting for $1 to name trump'
        }));
        this.addState(new StateData({
            value: ElementsPlayerStates.SETUP_KITTY,
            str: 'SETUP_KITTY',
            text: 'Populate the kitty'
        }));
        this.addState(new StateData({
            value: ElementsPlayerStates.WAIT_FOR_KITTY,
            str: 'WAIT_FOR_KITTY',
            text: 'Waiting for $1 to populate the kitty'
        }));
        this.addState(new StateData({
            value: ElementsPlayerStates.PLAY_CARD,
            str: 'PLAY_CARD',
            text: 'Waiting for $1 to play a card'
        }));
        this.addState(new StateData({
            value: ElementsPlayerStates.WAIT_FOR_CARD,
            str: 'WAIT_FOR_CARD',
            text: 'Waiting for $1 to play a card'
        }));
        this.addState(new StateData({
            value: ElementsPlayerStates.TAKE_TRICK,
            str: 'TAKE_TRICK',
            text: 'Waiting for $1 to take the trick'
        }));
        this.addState(new StateData({
            value: ElementsPlayerStates.WAIT_FOR_TAKE_TRICK,
            str: 'WAIT_FOR_TAKE_TRICK',
            text: 'Waiting for $1 to take the trick'
        }));
        this.addState(new StateData({
            value: ElementsPlayerStates.END_HAND,
            str: 'END_HAND',
            text: 'End of hand'
        }));
        this.addState(new StateData({
            value: ElementsPlayerStates.WAIT_FOR_END_HAND,
            str: 'WAIT_FOR_END_HAND',
            text: 'End of hand'
        }));
    }
}

export default ElementsPlayerStates;
