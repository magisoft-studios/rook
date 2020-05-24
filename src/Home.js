import React, { Component } from "react";
import Cam from "./Cam";

class Home extends Component {
    render() {
        return (
            <div>
                <h1>Welcome to Jennings Games</h1>
                <p>Our mission is to provide enjoyment for the whole family!</p>
                <div>
                    <button onClick={() => this.props.openTestGame()}>Test Game</button>
                </div>
                <div>
                </div>
            </div>
        );
    }
}

export default Home;