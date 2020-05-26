import React, { Component } from "react";
import Cam from "./Cam";

class Home extends Component {
    render() {
        return (
            <div className="homeDiv">
                <h1>Welcome to Jennings Gaming</h1>
                <p>Our mission is to spread happiness around the world through the enjoyment of gaming.</p>
            </div>
        );
    }

/*
                <div>
                    <button onClick={() => this.props.openTestGame()}>Test Game</button>
                </div>
 */
}

export default Home;