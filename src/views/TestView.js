import React, { Component } from "react";

class TestView extends Component {
    render() {
        return (
            <div className="homeDiv">
                <h2>Test View</h2>
                <div>
                    <button onClick={() => this.props.openTestGame("Tom", "player1")}>Player 1</button>
                    <button onClick={() => this.props.openTestGame("Abe", "player2")}>Player 2</button>
                    <button onClick={() => this.props.openTestGame("George", "player3")}>Player 3</button>
                    <button onClick={() => this.props.openTestGame("Teddy", "player4")}>Player 4</button>
                </div>
            </div>
        );
    }
}

export default TestView;