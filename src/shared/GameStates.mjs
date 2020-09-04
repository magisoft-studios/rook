import StateData from './StateData.mjs';

class GameStates {
    static INITIALIZING     =  0;   // Waiting for players to join
    static READY_TO_START   =  1;   // All players joined, can now enter game
    static WAIT_FOR_ENTER   =  2;   // Waiting for all players to enter
    static INIT_STREAM      =  3;   // All players entered, initializing streams
    static INIT_CONN        =  4;   // All players entered, initializing connections
    static READY_TO_PLAY    =  5;   // Ready to play game
    static END_OF_GAME      = 14;   // Announce end of game

    constructor() {
        this.stateValueMap = new Map();
        this.stateStrMap = new Map();

        this.addState(new StateData({
            value: GameStates.INITIALIZING,
            str: 'INITIALIZING',
            text: 'Waiting for players to join'
        }));
        this.addState(new StateData({
            value: GameStates.READY_TO_START,
            str: 'READY_TO_START',
            text: 'Ready to start'
        }));
        this.addState(new StateData({
            value: GameStates.WAIT_FOR_ENTER,
            str: 'WAIT_FOR_ENTER',
            text: 'Waiting for players to enter'
        }));
        this.addState(new StateData({
            value: GameStates.INIT_STREAM,
            str: 'INIT_STREAM',
            text: 'Initializing streams'
        }));
        this.addState(new StateData({
            value: GameStates.INIT_CONN,
            str: 'INIT_CONN',
            text: 'Initializing connections'
        }));
        this.addState(new StateData({
            value: GameStates.READY_TO_PLAY,
            str: 'READY_TO_PLAY',
            text: 'Ready to play'
        }));
        this.addState(new StateData({
            value: GameStates.END_OF_GAME,
            str: 'END_OF_GAME',
            text: 'Game is over'
        }));
    }

    addState(stateData) {
        this.stateValueMap.set(stateData.value, stateData);
        this.stateStrMap.set(stateData.str, stateData);
    }

    getStateByValue(value) {
        return this.stateValueMap.get(value);
    }

    getStateByStr(str) {
        return this.stateStrMap.get(str);
    }

}

export default GameStates;
