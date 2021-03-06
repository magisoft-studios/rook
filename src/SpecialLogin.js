import React, { Component } from 'react'
import MyButton from "./MyButton";
import './css/SpecialLogin.scss';

class SpecialLogin extends Component {
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
            const response = await fetch('/user/login', requestOptions);
            if (!response.ok) {
                const jsonResp = await response.json();
                console.log(`doLogin: response: ${JSON.stringify(jsonResp)}`);
                if (jsonResp.hasOwnProperty('errors')) {
                    let error = jsonResp.errors[0];
                    if (error.param === 'userId') {
                        alert(`Please enter a valid email address`);
                    } else if (error.param === 'password') {
                        alert(`Password must be at least 8 characters and no more than 30`);
                    } else {
                        alert(`Sorry, sign in failed, error:  ${error.msg}`);
                    }
                } else {
                    console.log(`doLogin: ${response}`);
                }
            } else {
                // Check for errors generated by express-validator.
                const jsonResp = await response.json();
                let reply = jsonResp.reply;
                if (reply.status === "SUCCESS") {
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
            <div className="specialLoginViewDiv">
                <span className="specialLoginORText">OR</span>
                <div className="specialLoginDiv">
                    <span className="specialLoginInstructionText">Sign in with email and password</span>
                    <div className="specialLoginFieldsDiv">
                        <label className="specialLoginUserLabel" htmlFor="user">Email Address</label>
                        <input
                            ref={this.userNameInput}
                            className="specialLoginUserText"
                            type="text"
                            id="user"
                            name="user"
                            value={this.state.userName}
                            onChange={this.handleUserChange} />
                        <label className="specialLoginPasswordLabel" htmlFor="password">Password</label>
                        <input
                            className="specialLoginPasswordText"
                            type="password"
                            id="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            onKeyPress={this.handleKeyPress} />
                    </div>
                    <div className="specialLoginBtnDiv">
                        <MyButton
                            btnClass="specialLoginSubmitBtn"
                            btnText="Sign In"
                            onClick={this.handleSubmit}>
                        </MyButton>
                    </div>
                </div>
            </div>
        );
    }
}

export default SpecialLogin;
