class Team {
    constructor(teamId, teamName) {
        this.id = teamId;
        this.name = teamName;

        // A map of player Id's indexed by their 'team position'
        // teamPosn can be 'player1', 'player2', etc.
        this.players = new Map();
    }

    addPlayer = (teamPosn, playerId) => {
        this.players.set(teamPosn, playerId);
    }

    removePlayer = (teamPosn) => {
        this.players.delete(teamPosn);
    }

    static toJson = (teamData) => {
        return {
            ...teamData,
            players: [...teamData.players],
        }
    }

    static fromJson = (teamJson) => {
        return {
            ...teamJson,
            players: new Map(teamJson.players)
        }
    }
}

export default Team;