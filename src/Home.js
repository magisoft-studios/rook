import React, { Component } from "react";

class Home extends Component {
    render() {
        return (
            <div>
                <h1>Welcome to Jennings Games</h1>
                <p>Our mission is to provide enjoyment for the whole family!</p>
                <div>
                    <button onClick={() => this.props.onEnterGame("TestGame", "player1")}>New Window</button>
                </div>
            </div>
        );
    }
}

export default Home;