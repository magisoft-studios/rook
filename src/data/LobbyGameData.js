import Team from './Team';

class LobbyGameData {
    constructor(creatorId, name, type, maxTeams, maxPlayers) {
        this.id = name;
        this.name = name;
        this.type = type;
        this.maxTeams = maxTeams;
        this.maxPlayers = maxPlayers;
        this.locked = false;
        this.creator = creatorId;
        this.invitees = [];
        this.playerCount = 0;

        // A map of teams indexed by teamId.
        // teamId can be 'team1', 'team2', etc.
        this.teams = new Map();

        // A map of players indexed by playerId.
        // playerId can be 'player1', 'player2', etc.
        this.players = new Map();
    }

    addPlayerToTeam = (playerId, teamId, teamPosn) => {
        let team = this.teams.get(teamId);
        team.addPlayer(teamPosn, playerId);
    }

    addPlayer = (player, playerPosn) => {
        if (! this.players.get(playerPosn)) {
            this.players.set(playerPosn, player);
            return true;
        } else {
            return false;
        }
    }

    removePlayer = (playerPosn) => {
        this.players.delete(playerPosn);
    }

    removePlayerFromTeam = (teamId, teamPosn) => {
        let team = this.teams.get(teamId);
        team.removePlayer(teamPosn);
    }

    addTeam = (teamId, teamName) => {
        this.teams.set(teamId, new Team(teamId, teamName));
    }

    static toJson = (lobbyGameData) => {
        let teams = [];
        lobbyGameData.teams.forEach( (team) => {
            teams.push(Team.toJson(team));
        });

        return {
            ...lobbyGameData,
            teams: teams,
            players: [...lobbyGameData.players],
        }
    }

    static fromJson = (lobbyGameDataJson) => {
        let teamMap = new Map();
        lobbyGameDataJson.teams.forEach( (team) => {
            teamMap.set(team.id, Team.fromJson(team))
        });
        let lobbyGameData = {
            ...lobbyGameDataJson,
            teams: teamMap,
            players: new Map(lobbyGameDataJson.players)
        }
        return lobbyGameData;
    }
}

export default LobbyGameData;