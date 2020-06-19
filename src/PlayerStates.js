
class PlayerStates {
    static LOBBY                =  0;   // In Lobby but not joined a game yet
    static JOINED_GAME          =  1;   // Opened game in Lobby but not joined a team yet
    static JOINED_TEAM          =  2;   // Joined a team in the game
    static ENTERED              =  3;   // Entered game
    static INIT_STREAM          =  4;   // Initializing streams
    static INIT_CONN            =  5;   // Initializing connections
    static DEAL                 =  6;   // It's this player's turn to deal
    static WAIT_FOR_DEAL        =  7;   // Waiting for another player to deal
    static BID                  =  8;   // It's this player's turn to bid
    static WAIT_FOR_BID         =  9;   // Waiting for other player's to bid
    static PASSED               = 10;   // This player has passed and is done bidding
    static BID_WON              = 11;   // This player won the bidding
    static NAME_TRUMP           = 12;   // This player is naming trump
    static WAIT_FOR_TRUMP       = 13;   // Waiting for another player to name trump
    static SETUP_KITTY          = 14;   // This player is taking kitty
    static WAIT_FOR_KITTY       = 15;   // Waiting for another player to fill the kitty
    static PLAY_CARD            = 16;   // It is this player's turn to play a card
    static WAIT_FOR_CARD        = 17;   // Waiting for another player to play a card
    static TRICK_WON            = 18;   // This player has won the trick
    static WAIT_FOR_TAKE_TRICK  = 19;   // Waiting for the trick winner to take the trick
    static END_HAND             = 20;   // End of Hand - Announce score, then go back to DEAL
    static WAIT_FOR_END_HAND    = 21;   // Wait for other player to end the hand
    static EXITED               = 22;   // Player exited game

    static getStateText(thisPlayer, otherPlayer) {
        let text = "";
        switch (thisPlayer.state) {
            case PlayerStates.LOBBY:
                text = "Viewing game in lobby";
                break;
            case PlayerStates.JOINED_GAME:
                text = "Joined Game";
                break;
            case PlayerStates.JOINED_TEAM:
                text = "Joined Team";
                break;
            case PlayerStates.ENTERED:
                text = "Entered";
                break;
            case PlayerStates.INIT_STREAM:
                text = "Initializing streams";
                break;
            case PlayerStates.INIT_CONN:
                text = "Initializing Connections";
                break;
            case PlayerStates.DEAL:
                text = "Dealing";
                break;
            case PlayerStates.WAIT_FOR_DEAL:
                text = "Waiting for " + otherPlayer.name + " to deal";
                break;
            case PlayerStates.BID:
                text = "It's your bid";
                break;
            case PlayerStates.WAIT_FOR_BID:
                text = "Waiting for " + otherPlayer.name + " to bid";
                break;
            case PlayerStates.PASSED:
                text = "Passed";
                break;
            case PlayerStates.BID_WON:
                text = thisPlayer.name + " won the bid";
                break;
            case PlayerStates.NAME_TRUMP:
                text = thisPlayer.name + " is naming trump";
                break;
            case PlayerStates.WAIT_FOR_TRUMP:
                text = "Waiting for " + otherPlayer.name + " to name trump";
                break;
            case PlayerStates.SETUP_KITTY:
                text = "Populate the kitty";
                break;
            case PlayerStates.WAIT_FOR_KITTY:
                text = "Waiting for " + otherPlayer.name + " to populate the kitty";
                break;
            case PlayerStates.PLAY_CARD:
                text = thisPlayer.name + " is playing a card";
                break;
            case PlayerStates.WAIT_FOR_CARD:
                text = "Waiting for " + otherPlayer.name + " to play a card";
                break;
            case PlayerStates.TRICK_WON:
                text = thisPlayer.name + " won the trick";
                break;
            case PlayerStates.WAIT_FOR_TAKE_TRICK:
                text = "Waiting for " + otherPlayer.name + " to take the trick";
                break;
            case PlayerStates.END_HAND:
                text = "End of hand";
                break;
            case PlayerStates.WAIT_FOR_END_HAND:
                text = "End of hand";
                break;
            case PlayerStates.EXITED:
                text = "Exited";
                break;
            default:
                text = "Invalid State";
                break;
        }
        return text;
    }
}

export default PlayerStates;
