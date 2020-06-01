import React, { Component } from "react";
import Cam from "./Cam";

class Home extends Component {
    render() {
        return (
            <div className="homeDiv">
                <h1>Welcome to Jennings Gaming</h1>
                <p>Our mission is to spread happiness around the world through the enjoyment of gaming.</p>
                <div>
                    <button onClick={() => this.props.openTestGame("Tom", "player1")}>Player 1</button>
                    <button onClick={() => this.props.openTestGame("Abe", "player2")}>Player 2</button>
                    <button onClick={() => this.props.openTestGame("George", "player3")}>Player 3</button>
                    <button onClick={() => this.props.openTestGame("Teddy", "player4")}>Player 4</button>
                </div>
            </div>
        );
    }

/*
 */
}

export default Home;