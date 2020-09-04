import PlayerStates from "./PlayerStates.mjs";

class GameUtils {
    static calcTeamId(playerPosn) {
        let team = "team1";
        if ((playerPosn === "player2") || (playerPosn === "player4")) {
            team = "team2";
        }
        return team;
    }

    static calcTeamPlayerSlot(playerPosn) {
        let slot = "player1Id";
        if ((playerPosn === "player3") || (playerPosn === "player4")) {
            slot = "player2Id";
        }
        return slot;
    }

    static isGameEmpty(gameData) {
        return (
            (gameData.player1 == null) &&
            (gameData.player2 == null) &&
            (gameData.player3 == null) &&
            (gameData.player4 == null)
        );
    }

    static areAllPlayersEntered(gameData) {
        if (gameData.desc.maxPlayers === 2) {
            return (
                (gameData.player1.state.value >= PlayerStates.ENTERED) &&
                (gameData.player2.state.value >= PlayerStates.ENTERED)
            );
        } else if (gameData.desc.maxPlayers === 4) {
            return (
                (gameData.player1.state.value >= PlayerStates.ENTERED) &&
                (gameData.player2.state.value >= PlayerStates.ENTERED) &&
                (gameData.player3.state.value >= PlayerStates.ENTERED) &&
                (gameData.player4.state.value >= PlayerStates.ENTERED)
            );
        }
    }

    static areAllStreamsInitialized(gameData) {
        if (gameData.desc.maxPlayers === 2) {
            return (
                (gameData.player1.state.value >= PlayerStates.INIT_CONN) &&
                (gameData.player2.state.value >= PlayerStates.INIT_CONN)
            );
        } else if (gameData.desc.maxPlayers === 4) {
            return (
                (gameData.player1.state.value >= PlayerStates.INIT_CONN) &&
                (gameData.player2.state.value >= PlayerStates.INIT_CONN) &&
                (gameData.player3.state.value >= PlayerStates.INIT_CONN) &&
                (gameData.player4.state.value >= PlayerStates.INIT_CONN)
            );
        }
    }

    static areAllConnectionsInitialized(gameData) {
        if (gameData.desc.maxPlayers === 2) {
            return (
                (gameData.player1.state.value >= PlayerStates.READY_TO_PLAY) &&
                (gameData.player2.state.value >= PlayerStates.READY_TO_PLAY)
            );
        } else if (gameData.desc.maxPlayers === 4) {
            return (
                (gameData.player1.state.value >= PlayerStates.READY_TO_PLAY) &&
                (gameData.player2.state.value >= PlayerStates.READY_TO_PLAY) &&
                (gameData.player3.state.value >= PlayerStates.READY_TO_PLAY) &&
                (gameData.player4.state.value >= PlayerStates.READY_TO_PLAY)
            );
        }
    }

    static getPlayerWithState(gameData, playerStateVal) {
        let player = null;
        if (gameData.player1 && gameData.player1.state.value === playerStateVal) {
            player = gameData.player1;
        } else if (gameData.player2 && gameData.player2.state.value === playerStateVal) {
            player = gameData.player2;
        } else if (gameData.player3 && gameData.player3.state.value === playerStateVal) {
            player = gameData.player3;
        } else if (gameData.player4 && gameData.player4.state.value === playerStateVal) {
            player = gameData.player4;
        }
        return player;
    }

    static setGameStateDisplayText(gameData, leadPlayerStateVal) {
        let stateText = gameData.state.text;
        if (stateText.includes("$1")) {
            let player = GameUtils.getPlayerWithState(gameData, leadPlayerStateVal);
            if (player) {
                stateText = stateText.replace("$1", player.name);
            }
        }
        gameData.stateDisplayText = stateText;
    }

    static setPlayerStateDisplayText(gameData, player, leadPlayerStateVal) {
        let stateText = player.state.text;
        if (stateText.includes("$1")) {
            let player = GameUtils.getPlayerWithState(gameData, leadPlayerStateVal);
            if (player) {
                stateText = stateText.replace("$1", player.name);
            }
        }
        player.stateDisplayText = stateText;
    }

}

export default GameUtils;