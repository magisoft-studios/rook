import React, { Component } from 'react'
import MyButton from "../MyButton";
import '../css/AccountView.scss';
import AppContext from "../ContextLib";
import LobbyView from "./LobbyView";

class AccountView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friendEmail: ""
        }
    }

    handleFriendEmailChange = (event) => {
        this.setState({friendEmail: event.target.value});
    }

    handleRemoveFriend = async (friendEmail) => {
        await this.doRemoveFriend(friendEmail);
    }

    handleAddFriend = async (event) => {
        await this.doAddFriend(this.state.friendEmail);
    }

    doAddFriend = async (friendEmail) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: this.context.session.id,
                friendEmail: friendEmail
            })
        };
        try {
            console.log(`doAddFriend: request: ${JSON.stringify(requestOptions)}`);
            const response = await fetch('/user/addFriend', requestOptions);
            if (!response.ok) {
                const jsonResp = await response.json();
                console.log(`doAddFriend: response: ${JSON.stringify(jsonResp)}`);
            } else {
                const jsonResp = await response.json();
                let reply = jsonResp.reply;
                if (reply.status === "SUCCESS") {
                    this.context.session.friends = reply.friends;
                    this.setState( {
                        friendEmail: ""
                    });
                } else {
                    alert(`${reply.errorMsg}`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    doRemoveFriend = async (friendEmail) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: this.context.session.id,
                friendEmail: friendEmail
            })
        };
        try {
            const response = await fetch('/user/removeFriend', requestOptions);
            if (!response.ok) {
                const jsonResp = await response.json();
                console.log(`doRemoveFriend: response: ${JSON.stringify(jsonResp)}`);
            } else {
                const jsonResp = await response.json();
                let reply = jsonResp.reply;
                if (reply.status === "SUCCESS") {
                    this.context.session.friends = reply.friends;
                    this.setState( {
                        friendEmail: ""
                    });
                } else {
                    alert(`${reply.errorMsg}`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    render() {
        let friendsTable = null;
        let friendCmpnts = [];
        if (this.context.session.friends.length > 0) {
            this.context.session.friends.forEach((friend, index) => {
                friendCmpnts.push(
                    <tr key={friend}>
                        <td>{friend}</td>
                        <td>
                            <MyButton
                                btnClass="accountViewRemoveFriendBtn"
                                btnText="Remove"
                                onClick={this.handleRemoveFriend}
                                onClickValue={friend}>
                            </MyButton>
                        </td>
                    </tr>
                )
            });

            friendsTable = (
                <table className="accountViewFriendsTable">
                    <thead>
                    <tr>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {friendCmpnts}
                    </tbody>
                </table>
            );
        }

        return (
            <div className="accountViewDiv">
                <div className="accountViewWelcomeMsg">
                    <span>Manage your User Profile Settings</span>
                </div>
                <div className="accountViewFriendsDiv">
                    <div className="accountViewFriendsTableDiv">
                        <span className="accountViewSectionTitle">Friends/Family</span>
                        {friendsTable}
                    </div>
                    <div className="accountViewAddFriendDiv">
                        <span className="accountViewSectionTitle">Add a Friend or Family Member</span>
                        <label className="accountViewFriendLabel" htmlFor="friend">Friend Email(must be valid email format)</label>
                        <input
                            className="accountViewFriendText"
                            type="text"
                            id="friend"
                            name="friend"
                            value={this.state.friendEmail}
                            onChange={this.handleFriendEmailChange} />
                        <MyButton
                            btnClass="accountViewAddFriendBtn"
                            btnText="Add"
                            onClick={this.handleAddFriend}
                            onClickValue={this.state.friendEmail}>
                        </MyButton>
                    </div>
                </div>
            </div>
        );
    }
}

AccountView.contextType = AppContext;

export default AccountView;
