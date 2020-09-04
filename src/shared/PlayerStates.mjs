import StateData from './StateData.mjs';

class PlayerStates {
    static LOBBY                =  0;   // In Lobby but not joined a game yet
    static JOINED_GAME          =  1;   // Opened game in Lobby but not joined a team yet
    static JOINED_TEAM          =  2;   // Joined a team in the game
    static ENTERED              =  3;   // Entered game
    static INIT_STREAM          =  4;   // Initializing streams
    static INIT_CONN            =  5;   // Initializing connections
    static READY_TO_PLAY        =  6;   // Ready to play
    static EXITED               = 23;   // Player exited game

    constructor() {
        this.stateValueMap = new Map();
        this.stateStrMap = new Map();

        this.addState(new StateData({
            value: PlayerStates.LOBBY,
            str: 'LOBBY',
            text: 'Viewing game in lobby'
        }));
        this.addState(new StateData({
            value: PlayerStates.JOINED_GAME,
            str: 'JOINED_GAME',
            text: 'Joined Gam'
        }));
        this.addState(new StateData({
            value: PlayerStates.JOINED_TEAM,
            str: 'JOINED_TEAM',
            text: 'Joined Team'
        }));
        this.addState(new StateData({
            value: PlayerStates.ENTERED,
            str: 'ENTERED',
            text: 'Entered'
        }));
        this.addState(new StateData({
            value: PlayerStates.INIT_STREAM,
            str: 'INIT_STREAM',
            text: 'Initializing streams'
        }));
        this.addState(new StateData({
            value: PlayerStates.INIT_CONN,
            str: 'INIT_CONN',
            text: 'Initializing connections'
        }));
        this.addState(new StateData({
            value: PlayerStates.READY_TO_PLAY,
            str: 'READY_TO_PLAY',
            text: 'Ready to play'
        }));
        this.addState(new StateData({
            value: PlayerStates.EXITED,
            str: 'EXITED',
            text: 'Exited'
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

export default PlayerStates;
