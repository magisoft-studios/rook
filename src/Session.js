class Session {
    constructor(props) {
        if (props) {
            this.loggedIn = props.loggedIn;
            this.loginMethod = props.loginMethod;
            this.id = props.id;
            this.playerId = props.playerId;
            this.playerName = props.playerName;
            this.currentGame = props.currentGame;
            this.permissions = props.permissions;
            this.friends = props.friends;
        } else {
            this.loggedIn = false;
            this.loginMethod = "";
            this.id = "";
            this.playerId = "";
            this.playerName = "";
            this.currentGame = {
                name: "",
                playerPosn: ""
            };
            this.permissions = {
                createGame: false,
            }
            this.friends = [];
        }
    }
}

export default Session;
