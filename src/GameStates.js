import PlayerStates from './PlayerStates';

class GameStates {
    static INITIALIZING     =  0;   // Waiting for players to join
    static READY_TO_START   =  1;   // All players joined, can now enter game
    static WAIT_FOR_ENTER   =  2;   // Waiting for all players to enter
    static INIT_STREAM      =  3;   // All players entered, initializing streams
    static INIT_CONN        =  4;   // All players entered, initializing connections
    static READY_TO_PLAY    =  5;   // Ready to play game
    static DEAL             =  6;   // Dealing - waiting for a player to deal
    static BIDDING          =  7;   // Going around the table bidding
    static BID_WON          =  8;   // Announcing Winner of Bid
    static NAME_TRUMP       =  9;   // Bid winner is declaring trump
    static POPULATE_KITTY   = 10;   // Bid winner is populating kitty
    static WAIT_FOR_CARD    = 11;   // Waiting for someone to play a card
    static TAKE_TRICK       = 12;   // Waiting for the winner of the trick to take it
    static END_OF_HAND      = 13;   // Announce end of hand
    static END_OF_GAME      = 14;   // Announce end of game

    static getStateText(gameData) {
        let text = "";
        let player = null;
        switch (gameData.state) {
            case GameStates.INITIALIZING: {
                text = "Waiting for players to join";
                break;
            }
            case GameStates.READY_TO_START: {
                text = "Ready to start";
                break;
            }
            case GameStates.WAIT_FOR_ENTER: {
                text = "Waiting for players to enter";
                break;
            }
            case GameStates.INIT_STREAM: {
                text = "Initializing streams";
                break;
            }
            case GameStates.INIT_CONN: {
                text = "Initializing connections";
                break;
            }
            case GameStates.READY_TO_PLAY: {
                text = "Ready to play";
                break;
            }
            case GameStates.DEAL: {
                player = GameStates.getPlayerWithState(gameData, PlayerStates.DEAL);
                text = "Waiting for " + player.name + " to deal";
                break;
            }
            case GameStates.BIDDING: {
                player = GameStates.getPlayerWithState(gameData, PlayerStates.BID);
                text = "Waiting for " + player.name + " to bid";
                break;
            }
            case GameStates.BID_WON: {
                player = GameStates.getPlayerWithState(gameData, PlayerStates.BID_WON);
                text = player.name + " has won the bidding";
                break;
            }
            case GameStates.NAME_TRUMP: {
                player = GameStates.getPlayerWithState(gameData, PlayerStates.NAME_TRUMP);
                text = "Waiting for " + player.name + " to declare trump suit";
                break;
            }
            case GameStates.POPULATE_KITTY: {
                player = GameStates.getPlayerWithState(gameData, PlayerStates.SETUP_KITTY);
                text = "Waiting for " + player.name + " to populate the kitty";
                break;
            }
            case GameStates.WAIT_FOR_CARD: {
                player = GameStates.getPlayerWithState(gameData, PlayerStates.PLAY_CARD);
                text = "Waiting for " + player.name + " to play a card";
                break;
            }
            case GameStates.TAKE_TRICK: {
                player = GameStates.getPlayerWithState(gameData, PlayerStates.TRICK_WON);
                text = "Waiting for " + player.name + " to take the trick";
                break;
            }
            case GameStates.END_OF_HAND: {
                text = "End of hand";
                break;
            }
            case GameStates.END_OF_GAME: {
                text = "Game is over";
                break;
            }
            default: {
                text = "Invalid State";
                break;
            }
        }
        return text;
    }

    static getPlayerWithState(gameData, playerState) {
        let player = null;
        if (gameData.player1 && gameData.player1.state === playerState) {
            player = gameData.player1;
        } else if (gameData.player2 && gameData.player2.state === playerState) {
            player = gameData.player2;
        } else if (gameData.player3 && gameData.player3.state === playerState) {
            player = gameData.player3;
        } else if (gameData.player4 && gameData.player4.state === playerState) {
            player = gameData.player4;
        }
        return player;
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
                (gameData.player1.state >= PlayerStates.ENTERED) &&
                (gameData.player2.state >= PlayerStates.ENTERED)
            );
        } else if (gameData.desc.maxPlayers === 4) {
            return (
                (gameData.player1.state >= PlayerStates.ENTERED) &&
                (gameData.player2.state >= PlayerStates.ENTERED) &&
                (gameData.player3.state >= PlayerStates.ENTERED) &&
                (gameData.player4.state >= PlayerStates.ENTERED)
            );
        }
    }

    static areAllStreamsInitialized(gameData) {
        if (gameData.desc.maxPlayers === 2) {
            return (
                (gameData.player1.state >= PlayerStates.INIT_CONN) &&
                (gameData.player2.state >= PlayerStates.INIT_CONN)
            );
        } else if (gameData.desc.maxPlayers === 4) {
            return (
                (gameData.player1.state >= PlayerStates.INIT_CONN) &&
                (gameData.player2.state >= PlayerStates.INIT_CONN) &&
                (gameData.player3.state >= PlayerStates.INIT_CONN) &&
                (gameData.player4.state >= PlayerStates.INIT_CONN)
            );
        }
    }

    static areAllConnectionsInitialized(gameData) {
        if (gameData.desc.maxPlayers === 2) {
            return (
                (gameData.player1.state >= PlayerStates.READY_TO_PLAY) &&
                (gameData.player2.state >= PlayerStates.READY_TO_PLAY)
            );
        } else if (gameData.desc.maxPlayers === 4) {
            return (
                (gameData.player1.state >= PlayerStates.READY_TO_PLAY) &&
                (gameData.player2.state >= PlayerStates.READY_TO_PLAY) &&
                (gameData.player3.state >= PlayerStates.READY_TO_PLAY) &&
                (gameData.player4.state >= PlayerStates.READY_TO_PLAY)
            );
        }
    }

}

export default GameStates;
