import React, { Component } from 'react'
import './css/NewGameDialog.scss';
import AppContext from "./ContextLib";
import LobbyView from "./views/LobbyView";
import GameStates from "./GameStates";

class NewGameDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameName: "",
            gameType: "Elements",
            invitee1: props.friends[0],
            invitee2: props.friends[1],
            invitee3: props.friends[2],
        }

        this.gameNameInput = React.createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.invitee1.length === 0) {
            this.setState({
                invitee1: this.context.session.friends[0],
                invitee2: this.context.session.friends[1],
                invitee3: this.context.session.friends[2],
            });
        }
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

    handleInvitee1Change = (event) => {
        this.setState({invitee1: event.target.value});
    }

    handleInvitee2Change = (event) => {
        this.setState({invitee2: event.target.value});
    }

    handleInvitee3Change = (event) => {
        this.setState({invitee3: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.gameName.length === 0) {
            alert("Please enter a game name!");
        }
        if (this.state.invitee1.length === 0) {
            alert("You must invite 3 other players!");
        }
        if (this.state.invitee2.length === 0) {
            alert("You must invite 3 other players!");
        }
        if (this.state.invitee3.length === 0) {
            alert("You must invite 3 other players!");
        }
        let inviteeList = [
            this.state.invitee1.trim(),
            this.state.invitee2.trim(),
            this.state.invitee3.trim()
        ];
        this.props.onOk(this.state.gameName, this.state.gameType, inviteeList);
    }

    createInviteeOptions = (invitedFriends) => {
        let friends = this.context.session.friends;
        let filteredFriends = friends.filter( (friend) => {
            return (! invitedFriends.includes(friend));
        });
        return filteredFriends;
    }

    render() {
        let options1 = this.createInviteeOptions([this.state.invitee2, this.state.invitee3]);
        let invitee1Options = [];
        for (let i = 0; i < options1.length; i++) {
            let invitee = options1[i];
            invitee1Options.push(<option key={invitee} value={invitee}>{invitee}</option>);
        }

        let options2 = this.createInviteeOptions([this.state.invitee1, this.state.invitee3]);
        let invitee2Options = [];
        for (let i = 0; i < options2.length; i++) {
            let invitee = options2[i];
            invitee2Options.push(<option key={invitee} value={invitee}>{invitee}</option>);
        }

        let options3 = this.createInviteeOptions([this.state.invitee1, this.state.invitee2]);
        let invitee3Options = [];
        for (let i = 0; i < options3.length; i++) {
            let invitee = options3[i];
            invitee3Options.push(<option key={invitee} value={invitee}>{invitee}</option>);
        }

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
                        <label className="newGameDlgGameTypeLabel" htmlFor="gameType">Game Type</label>
                        <select
                            className="newGameDlgGameTypeText"
                            id="gameType"
                            name="gameType"
                            value={this.state.gameType}
                            onChange={this.handleTypeChange}>
                            <option value="Elements">Elements</option>
                            <option value="Rook">Rook</option>
                            <option value="ConnectionTest">ConnectionTest</option>
                        </select>
                        <label className="newGameDlgInviteesLabel" htmlFor="gameInvitee1">Invitee 1</label>
                        <select
                            className="newGameDlgInviteesText"
                            id="gameInvitee1"
                            name="gameInvitee1"
                            value={this.state.invitee1}
                            onChange={this.handleInvitee1Change}>
                            {invitee1Options}
                        </select>
                        <label className="newGameDlgInviteesLabel" htmlFor="gameInvitee2">Invitee 2</label>
                        <select
                            className="newGameDlgInviteesText"
                            id="gameInvitee2"
                            name="gameInvitee2"
                            value={this.state.invitee2}
                            onChange={this.handleInvitee2Change}>
                            {invitee2Options}
                        </select>
                        <label className="newGameDlgInviteesLabel" htmlFor="gameInvitee3">Invitee 3</label>
                        <select
                            className="newGameDlgInviteesText"
                            id="gameInvitee3"
                            name="gameInvitee3"
                            value={this.state.invitee3}
                            onChange={this.handleInvitee3Change}>
                            {invitee3Options}
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

NewGameDialog.contextType = AppContext;

export default NewGameDialog;

