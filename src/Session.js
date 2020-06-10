class Session {
    constructor(props) {
        if (props) {
            this.loggedIn = props.loggedIn;
            this.id = props.id;
            this.playerId = props.playerId;
            this.playerName = props.playerName;
            this.currentGame = props.currentGame;
            this.currentGame = props.permissions;
        } else {
            this.loggedIn = false;
            this.id = "";
            this.playerId = "";
            this.playerName = "";
            this.currentGame = {
                id: "",
                playerPosn: ""
            };
            this.permissions = {
                createGame: false,
            }
        }
    }
}

export default Session;
