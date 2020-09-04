import GameStates from './GameStates.mjs';
import StateData from './StateData.mjs';

class ElementsGameStates extends GameStates {
    static DEAL             =  6;   // Dealing - waiting for a player to deal
    static BID              =  7;   // Going around the table bidding
    static BID_WON          =  8;   // Announcing Winner of Bid
    static NAME_TRUMP       =  9;   // Bid winner is declaring trump
    static POPULATE_KITTY   = 10;   // Bid winner is populating kitty
    static WAIT_FOR_CARD    = 11;   // Waiting for someone to play a card
    static TAKE_TRICK       = 12;   // Waiting for the winner of the trick to take it
    static END_OF_HAND      = 13;   // Announce end of hand

    constructor() {
        super();
        this.addState(new StateData({
            value: ElementsGameStates.DEAL,
            str: 'DEAL',
            text: 'Waiting for $1 to deal'
        }));
        this.addState(new StateData({
            value: ElementsGameStates.BID,
            str: 'BID',
            text: 'Waiting for $1 to bid'
        }));
        this.addState(new StateData({
            value: ElementsGameStates.BID_WON,
            str: 'BID_WON',
            text: '$1 has won the bidding'
        }));
        this.addState(new StateData({
            value: ElementsGameStates.NAME_TRUMP,
            str: 'NAME_TRUMP',
            text: 'Waiting for $1 to declare trump suit'
        }));
        this.addState(new StateData({
            value: ElementsGameStates.SETUP_KITTY,
            str: 'SETUP_KITTY',
            text: 'Waiting for $1 to populate the kitty'
        }));
        this.addState(new StateData({
            value: ElementsGameStates.PLAY_CARD,
            str: 'PLAY_CARD',
            text: 'Waiting for $1 to play a card'
        }));
        this.addState(new StateData({
            value: ElementsGameStates.TAKE_TRICK,
            str: 'TAKE_TRICK',
            text: 'Waiting for $1 to take the trick'
        }));
        this.addState(new StateData({
            value: ElementsGameStates.END_OF_HAND,
            str: 'END_OF_HAND',
            text: 'End of hand'
        }));
    }

 }

export default ElementsGameStates;
