import PlayerStates from './PlayerStates';

class GameStates {
    static INITIALIZING     =  0;   // Waiting for players to join
    static READY_TO_START   =  1;   // All players joined, can now enter game
    static WAIT_FOR_ENTER   =  2;   // Waiting for all players to enter
    static INIT_STREAM      =  3;   // All players entered, initializing streams
    static INIT_CONN        =  4;   // All players entered, initializing connections
    static DEAL             =  5;   // Dealing - waiting for a player to deal
    static BIDDING          =  6;   // Going around the table bidding
    static BID_WON          =  7;   // Announcing Winner of Bid
    static NAME_TRUMP       =  8;   // Bid winner is declaring trump
    static POPULATE_KITTY   =  9;   // Bid winner is populating kitty
    static WAIT_FOR_CARD    = 10;   // Waiting for someone to play a card
    static TAKE_TRICK       = 11;   // Waiting for the winner of the trick to take it
    static END_OF_HAND      = 12;   // Announce end of hand
    static END_OF_GAME      = 13;   // Announce end of game

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
            case GameStates.INIT_STREAM:
                text = "Initializing streams";
                break;
            case GameStates.INIT_CONN:
                text = "Initializing connections";
                break;
            case GameStates.DEAL:
                text = "Waiting for " + player.name + " to deal";
                break;
            case GameStates.BIDDING:
                text = "Waiting for " + player.name + " to bid";
                break;
            case GameStates.BID_WON:
                text = player.name + " has won the bidding";
                break;
            case GameStates.NAME_TRUMP:
                text = "Waiting for " + player.name + " to declare trump suit";
                break;
            case GameStates.POPULATE_KITTY:
                text = "Waiting for " + player.name + " to populate the kitty";
                break;
            case GameStates.WAIT_FOR_CARD:
                text = "Waiting for " + player.name + " to play a card";
                break;
            case GameStates.TAKE_TRICK:
                text = "Waiting for " + player.name + " to take the trick";
                break;
            case GameStates.END_OF_HAND:
                text = "End of hand";
                break;
            case GameStates.END_OF_GAME:
                text = "Game is over";
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

    static areAllPlayersEntered(gameData) {
        return (
            (gameData.player1.state === PlayerStates.ENTERED) &&
            (gameData.player2.state === PlayerStates.ENTERED) &&
            (gameData.player3.state === PlayerStates.ENTERED) &&
            (gameData.player4.state === PlayerStates.ENTERED)
        );
    }

    static areAllStreamsInitialized(gameData) {
        return (
            (gameData.player1.state === PlayerStates.INIT_CONN) &&
            (gameData.player2.state === PlayerStates.INIT_CONN) &&
            (gameData.player3.state === PlayerStates.INIT_CONN) &&
            (gameData.player4.state === PlayerStates.INIT_CONN)
        );
    }

    static areAllConnectionsInitialized(gameData) {
        return (
            (gameData.player1.state === PlayerStates.WAIT_FOR_DEAL) &&
            (gameData.player2.state === PlayerStates.WAIT_FOR_DEAL) &&
            (gameData.player3.state === PlayerStates.WAIT_FOR_DEAL) &&
            (gameData.player4.state === PlayerStates.WAIT_FOR_DEAL)
        );
    }

}

export default GameStates;
