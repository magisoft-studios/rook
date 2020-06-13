import React, { Component } from 'react'
import './css/NewGameDialog.scss';

class NewGameDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameName: "",
            gameType: "Rook"
        }

        this.gameNameInput = React.createRef();
    }

    componentDidMount() {
        if (this.props.show) {
            this.gameNameInput.current.focus();
        }
    }

    handleNameChange = (event) => {
        this.setState({gameName: event.target.value});
    }

    handleTypeChange = (event) => {
        this.setState({gameType: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.onOk(this.state.gameName, this.state.gameType);
    }

    render() {
        return (
            <div className="newGameDlgDiv">
                <form onSubmit={this.handleSubmit}>
                    <div className="newGameDlgFormDiv">
                        <label className="newGameDlgGameNameLabel" htmlFor="gameName">Game Name</label>
                        <input
                            ref={this.gameNameInput}
                            className="newGameDlgGameNameText"
                            type="text"
                            id="gameName"
                            name="gameName"
                            value={this.state.gameName}
                            onChange={this.handleNameChange}/>
                        <label className="newGameDlgGameTypeLabel" htmlFor="gameType">GameType</label>
                        <select
                            className="newGameDlgGameTypeText"
                            id="gameType"
                            name="gameType"
                            value={this.state.gameType}
                            onChange={this.handleTypeChange}>
                            <option value="Rook">Rook</option>
                        </select>
                        <div className="newGameBtnDiv">
                            <input className="newGameSubmitBtn" type="submit" value="OK"/>
                            <button type="button"
                                    className="newGameCancelBtn"
                                    onClick={this.props.onCancel}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default NewGameDialog;

