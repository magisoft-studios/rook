
/* Player States:
    LOBBY                 Opened game in Lobby but not joined yet
    JOINED                Joined game in Lobby but did not enter game yet
    ENTERED               Entered game
    DEAL                  It's this player's turn to deal
    WAIT_FOR_DEAL         Waiting for another player to deal
    BID                   It's this player's turn to bid
    WAIT_BID              Waiting for other player's to bid
    PASSED                This player has passed and is done bidding
    BID_WON               This player won the bidding
    NAME_TRUMP            This player is naming trump
    WAIT_FOR_TRUMP        Waiting for another player to name trump
    TAKE_KITTY            This player is taking kitty
    WAIT_KITTY            Waiting for another player to fill the kitty
    FILL_KITTY            This player is filling kitty
    WAIT_KITTY            Waiting for another player to fill the kitty
    WAIT_FOR_CARD         Waiting for another player to play a card
    PLAY_CARD             It is this player's turn to play a card
    TRICK_WON             This player has won the trick
    TAKE_TRICK            This player is taking the trick
    END_OF_HAND           End of Hand - Announce score, then go back to DEAL
*/
/*
module.exports = Object.freeze({
    LOBBY: 0,
    JOINED: 1,
    ENTERED: 2,
    WAIT_FOR_DEAL: 3
    DEAL: 3,
    WAIT_BID: 4,
    BID: 5,
    PASSED: 6,
    BID_WON: 7,
    NAME_TRUMP: 8,
    WAIT_FOR_TRUMP: 9,
    TAKE_KITTY: 10,
    WAIT_KITTY: 11,
    FILL_KITTY: 12,
    WAIT_KITTY: 13,
    WAIT_FOR_CARD: 14,
    PLAY_CARD: 15,
    TRICK_WON: 16,
    TAKE_TRICK: 17,
    END_OF_HAND: 18,
});
 */
import GameStates from "./GameStates";

class PlayerStates {
    static LOBBY = 0;
    static JOINED = 1;
    static ENTERED = 2;
    static DEAL = 4;
    static WAIT_FOR_DEAL = 5;

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
            default:
                text = "Invalid State";
                break;
        }
        return text;
    }
}

export default PlayerStates;
