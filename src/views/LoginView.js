import React, { Component } from 'react'
import MyButton from "../MyButton";

class LoginView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            password: "",
        }
        this.userNameInput = React.createRef();
    }

    componentDidMount() {
        this.userNameInput.current.focus();
    }

    handleUserChange = (event) => {
        this.setState({userName: event.target.value});
    }

    handlePasswordChange = (event) => {
        this.setState({password: event.target.value});
    }

    handleKeyPress = (event) => {
        if (event.key === "Enter") {
            this.handleSubmit(event);
        }
    }

    handleSubmit = (event) => {
        this.doLogin();
    }

    doLogin = async () => {
        console.log("doLogin START");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: this.state.userName,
                password: this.state.password,
            })
        };
        try {
            const response = await fetch('/rook/login', requestOptions);
            if (!response.ok) {
                console.log(`doLogin: response is NOT OK: ${response.statusText}`);
            } else {
                console.log("doLogin: response is OK");
                const jsonResp = await response.json();
                console.log(`doLogin: response: ${JSON.stringify(jsonResp)}`);
                let reply = jsonResp.reply;
                if (reply.status === "SUCCESS") {
                    console.log("doLogin: SUCCESS");
                    this.props.onLogin(reply);
                } else {
                    alert(`${reply.errorMsg}`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div className="loginViewDiv">
                <div className="loginWelcomeMsg"><span>Welcome to Jennings Gaming!</span></div>
                <div className="loginInstructionMsg">
                    <span className="loginInstructionText">Please login to continue</span></div>
                    <div className="loginFormDiv">
                        <label className="loginUserLabel" htmlFor="user">Email Address</label>
                        <input
                            ref={this.userNameInput}
                            className="loginUserText"
                            type="text"
                            id="user"
                            name="user"
                            value={this.state.userName}
                            onChange={this.handleUserChange} />
                        <label className="loginPasswordLabel" htmlFor="password">Password</label>
                        <input
                            className="loginPasswordText"
                            type="password"
                            id="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            onKeyPress={this.handleKeyPress} />
                        <div className="loginBtnDiv">
                            <MyButton
                                btnClass="loginSubmitBtn"
                                btnText="Login"
                                onClick={this.handleSubmit}>
                            </MyButton>
                        </div>
                    </div>
            </div>
        );
    }
}

export default LoginView;