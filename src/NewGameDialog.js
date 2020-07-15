import React, { Component } from 'react'
import './css/NewGameDialog.scss';
import AppContext from "./ContextLib";
import MyButton from "./MyButton";

class NewGameDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gameName: "",
            gameType: "Elements",
            invitees: [],
            inviteeText: "",
            inviteeSelect: ""
        }

        this.gameNameInput = React.createRef();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(`componentDidUpdate: inviteeSelect length = ${this.state.inviteeSelect.length}`);
        if ((this.state.inviteeSelect.length === 0) || (prevState.invitees.length != this.state.invitees.length)) {
            let friendList = this.filterFriendsList();
            if (friendList.length > 0) {
                this.setState({
                    inviteeSelect: friendList[0]
                });
            }
        }
    }

    componentDidMount() {
        this.gameNameInput.current.focus();
        let friendList = this.filterFriendsList();
        if (friendList.length > 0) {
            this.setState({
                inviteeSelect: friendList[0]
            });
        }
    }

    handleNameChange = (event) => {
        this.setState({gameName: event.target.value});
    }

    handleTypeChange = (event) => {
        this.setState({gameType: event.target.value});
    }

    handleInviteeTextChange = (event) => {
        this.setState({inviteeText: event.target.value});
    }

    handleInviteeSelectChange = (event) => {
        this.setState({inviteeSelect: event.target.value});
    }

    handleAddInvitee = async (invitee) => {
        console.log(`handleAddInvitee: ${invitee}`);
        if (invitee.length > 0) {
            let invitees = this.state.invitees.slice();
            invitees.push(invitee);
            this.setState({
                invitees: invitees,
                inviteeText: ""
            });
        }
    }

    handleRemoveInvitee = async (invitee) => {
        let invitees = this.state.invitees.filter((email) => {
            return (email !== invitee);
        });
        this.setState( {
            invitees: invitees
        });
    }

    handleOkBtn = () => {
        if (this.state.gameName.length === 0) {
            alert("Please enter a game name!");
            return;
        } else if (this.state.invitees.length < 3) {
            alert("You must invite 3 other players!");
            return
        }
        this.props.onOk(this.state.gameName, this.state.gameType, this.state.invitees);
    }

    filterFriendsList = () => {
        let friends = this.context.session.friends;
        let filteredFriends = friends.filter( (friend) => {
            return (! this.state.invitees.includes(friend));
        });
        return filteredFriends;
    }

    render() {
        let availableFriends = this.filterFriendsList();
        let inviteeOptions = [];
        availableFriends.forEach( (friend) => {
            inviteeOptions.push(<option key={friend} value={friend}>{friend}</option>);
        });

        let inviteesTable = null;
        let inviteeCmpnts = [];
        let inviteeList = this.state.invitees;
        inviteeList.forEach((invitee, index) => {
            inviteeCmpnts.push(
                <tr key={invitee}>
                    <td>{invitee}</td>
                    <td>
                        <MyButton
                            btnClass="newGameDlgRemoveInviteeBtn"
                            btnText="Remove"
                            onClick={this.handleRemoveInvitee}
                            onClickValue={invitee}>
                        </MyButton>
                    </td>
                </tr>
            )
        });

        if (inviteeList.length < 3) {
            inviteeCmpnts.push(
                <tr key="placeholder">
                    <td>Must invite {3 - inviteeList.length} more players!</td>
                    <td></td>
                </tr>
            )
        }

        inviteesTable = (
            <table className="newGameDlgInviteesTable">
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {inviteeCmpnts}
                </tbody>
            </table>
        );

        return (
            <div className="newGameDlgDiv">
                <span className="newGameDlgTitle">Create New Game</span>
                <label className="newGameDlgGameNameLabel" htmlFor="newGameName">Game Name</label>
                <input
                    ref={this.gameNameInput}
                    className="newGameDlgGameNameText"
                    type="text"
                    id="newGameName"
                    name="newGameName"
                    value={this.state.gameName}
                    onChange={this.handleNameChange}
                />
                <label className="newGameDlgGameTypeLabel" htmlFor="newGameType">Game Type</label>
                <select
                    className="newGameDlgGameTypeText"
                    id="newGameType"
                    name="newGameType"
                    value={this.state.gameType}
                    onChange={this.handleTypeChange}>
                    <option value="Elements">Elements</option>
                </select>
                <span className="newGameDlgInviteesSectionTitle">Invitees</span>
                <div className="newGameDlgInviteesSectionDiv">
                    <div className="newGameDlgInviteesTableDiv">
                        {inviteesTable}
                    </div>
                    <div className="newGameDlgAddInviteesDiv">
                        <span className="newGameDlgAddInviteeMsgText">Select from your friend list or type an email address.</span>
                        <span className="newGameDlgAddInviteeMsgText">(You can modify your friend list on the 'My Profile' page).</span>
                        <div className="newGameDlgInviteesSelectDiv">
                            <select
                                className="newGameDlgInviteesSelect"
                                id="newGameInviteeSelect"
                                name="newGameInviteeSelect"
                                value={this.state.inviteeSelect}
                                onChange={this.handleInviteeSelectChange}>
                                {inviteeOptions}
                            </select>
                            <MyButton
                                btnClass="newGameAddInviteeSelectBtn"
                                btnText="Add"
                                disabled={((this.state.inviteeSelect.length === 0) || (this.state.invitees.length === 3))}
                                onClick={this.handleAddInvitee}
                                onClickValue={this.state.inviteeSelect}>
                            </MyButton>
                        </div>
                        <div className="newGameDlgInviteesTextDiv">
                            <input
                                className="newGameDlgInviteeText"
                                type="text"
                                id="newGameInviteeText"
                                name="newGameInviteeText"
                                value={this.state.inviteeText}
                                onChange={this.handleInviteeTextChange}
                            />
                            <MyButton
                                btnClass="newGameAddInviteeTextBtn"
                                btnText="Add"
                                disabled={((this.state.inviteeText.length === 0) || (this.state.invitees.length === 3))}
                                onClick={this.handleAddInvitee}
                                onClickValue={this.state.inviteeText}>
                            </MyButton>
                        </div>
                    </div>
                </div>
                <div className="newGameDlgBtnDiv">
                    <MyButton
                        btnClass="newGameDlgOkBtn"
                        btnText="OK"
                        onClick={this.handleOkBtn}>
                    </MyButton>
                    <MyButton
                        btnClass="newGameDlgCancelBtn"
                        btnText="Cancel"
                        onClick={this.props.onCancel}>
                    </MyButton>
                </div>
            </div>
        );
    }
}

NewGameDialog.contextType = AppContext;

export default NewGameDialog;

