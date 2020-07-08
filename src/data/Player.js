import PlayerStates from '../PlayerStates';

class Player {
    constructor(id, teamId) {
        this.id = id;
        this.name = id;
        this.socketId = null;
        this.enteredGame = false;
        this.imgName = null;
        this.teamId = teamId;
        this.state = PlayerStates.LOBBY;
        this.stateText = "";
        this.bid = 0;
        this.numCards = 0;
        this.cards = [];
    }
}

export default Player;