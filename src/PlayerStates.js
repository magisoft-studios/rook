
class PlayerStates {
    static LOBBY = 0;               // Opened game in Lobby but not joined yet
    static JOINED = 1;              // Joined game in Lobby but did not enter game yet
    static ENTERED = 2;             // Entered game
    static DEAL = 4;                // It's this player's turn to deal
    static WAIT_FOR_DEAL = 5;       // Waiting for another player to deal
    static BID = 6;                 // It's this player's turn to bid
    static WAIT_FOR_BID = 7;        // Waiting for other player's to bid
    static PASSED = 8;              // This player has passed and is done bidding
    static BID_WON = 9;             // This player won the bidding
    static NAME_TRUMP = 10;         // This player is naming trump
    static WAIT_FOR_TRUMP = 11;     // Waiting for another player to name trump
    static SETUP_KITTY = 12;        // This player is taking kitty
    static WAIT_FOR_KITTY = 13;     // Waiting for another player to fill the kitty
    static PLAY_CARD = 14;          // It is this player's turn to play a card
    static WAIT_FOR_CARD = 15;      // Waiting for another player to play a card
    static TRICK_WON = 16;          // This player has won the trick
    static TAKE_TRICK = 17;         // This player is taking the trick
    static END_OF_HAND = 18;        // End of Hand - Announce score, then go back to DEAL

    static getStateText(thisPlayer, otherPlayer) {
        let text = "";
        switch (thisPlayer.state) {
            case PlayerStates.LOBBY:
                text = "Viewing game in lobby";
                break;
            case PlayerStates.JOINED:
                text = "Joined";
                break;
            case PlayerStates.ENTERED:
                text = "Entered";
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
            default:
                text = "Invalid State";
                break;
        }
        return text;
    }
}

export default PlayerStates;
