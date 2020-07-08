import React, { Component } from 'react'
import MyButton from "../MyButton";
import '../css/LoginView.scss';
import GoogleLogin from 'react-google-login';

class LoginView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            password: "",
        }
        this.userNameInput = React.createRef();
        this.resizeTimer = null;
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

    doGoogleLogin = async (token) => {
        console.log("doGoogleLogin START");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token
            })
        };
        try {
            const response = await fetch('/user/googlelogin', requestOptions);
            if (!response.ok) {
                const jsonResp = await response.json();
                console.log(`doLogin: response NOT OK: ${JSON.stringify(jsonResp)}`);
            } else {
                // Check for errors generated by express-validator.
                const jsonResp = await response.json();
                let reply = jsonResp.reply;
                if (reply.status === "SUCCESS") {
                    console.log("doGoogleLogin: SUCCESS");
                    this.props.onLogin(reply);
                } else {
                    alert(`${reply.errorMsg}`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleGoogleResponse = (response) => {
        //console.log(`LoginView: handleGoogleResponse: ${JSON.stringify(response)}`);
        let token = response.tokenId;
        this.doGoogleLogin(token);
    }

    render() {
        return (
            <div className="loginViewDiv">
                <div className="loginWelcomeMsg">
                    <span>Welcome to Jennings Gaming!</span>
                </div>
                <div className="loginInstructionMsg">
                    <span className="loginInstructionText">Please sign in to continue</span>
                </div>
                <div className="loginGoogleDiv">
                    <span className="loginInstructionText">Sign in with Google account</span>
                    <div className="loginGoogleBtnDiv">
                        <GoogleLogin
                            className="loginGoogleBtn"
                            clientId="143514624122-ie3dtumrn2f28ge6hlntvmj7v45j4k8o.apps.googleusercontent.com"
                            buttonText="Sign In with Google"
                            onSuccess={this.handleGoogleResponse}
                            onFailure={this.handleGoogleResponse}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                </div>
                <span className="loginORText">OR</span>
                <div className="loginDiv">
                    <span className="loginInstructionText">Sign in with email and password</span>
                    <div className="loginFieldsDiv">
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
                    </div>
                    <div className="loginBtnDiv">
                        <MyButton
                            btnClass="loginSubmitBtn"
                            btnText="Sign In"
                            onClick={this.handleSubmit}>
                        </MyButton>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginView;
