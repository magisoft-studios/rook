import PlayerStates from './PlayerStates';
import CardTable from "./CardTable";

/* Game States:
    INITIALIZING          Waiting for players to join
    READY_TO_START        Ready to start, all players joined
    WAIT_FOR_ENTER        Waiting for all players to enter
    DEAL                  Deal - waiting for a player to deal
    WAIT_FOR_BID          Waiting for a player to bid
    BID_WON               Announce Winner of Bid
    NAME_TRUMP            Bid Winner Names Trump
    TAKE_KITTY            Bid Winner Takes Kitty
    FILL_KITTY            Bid Winner Fills Kitty
    WAIT_FOR_CARD         Waiting for Player to Play Card
    TRICK_WON             Announce Winner of Trick
    TAKE_TRICK            Waiting for Player to Take Trick
    END_OF_HAND           End of Hand - Announce score, then go back to DEAL
*/

class GameStates {
    static INITIALIZING = 0;
    static READY_TO_START = 1;
    static WAIT_FOR_ENTER = 2;
    static DEAL = 4;

    static getStateText(gameData, player) {
        let text = "";
        switch (gameData.state) {
            case GameStates.INITIALIZING:
                text = "Waiting for players to join";
                break;
            case GameStates.READY_TO_START:
                text = "Ready to enter";
                break;
            case GameStates.WAIT_FOR_ENTER:
                text = "Waiting for players to enter";
                break;
            case GameStates.DEAL:
                text = "Waiting for " + player.name + " to deal";
                break;
            default:
                text = "Invalid State";
                break;
        }
        return text;
    }

    static isGameFull(gameData) {
        return (
            (gameData.player1.state === PlayerStates.JOINED) &&
            (gameData.player2.state === PlayerStates.JOINED) &&
            (gameData.player3.state === PlayerStates.JOINED) &&
            (gameData.player4.state === PlayerStates.JOINED)
        );
    }

    static isGameEmpty(gameData) {
        return (
            (gameData.player1.id == null) &&
            (gameData.player2.id == null) &&
            (gameData.player3.id == null) &&
            (gameData.player4.id == null)
        );
    }

    static isAllPlayersEntered(gameData) {
        return (
            (gameData.player1.state === PlayerStates.ENTERED) &&
            (gameData.player2.state === PlayerStates.ENTERED) &&
            (gameData.player3.state === PlayerStates.ENTERED) &&
            (gameData.player4.state === PlayerStates.ENTERED)
        );
    }

}

export default GameStates;
