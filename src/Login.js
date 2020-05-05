import React, { Component } from 'react'

class Login extends Component {
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

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state.userName, this.state.password);
    }

    render() {
        return (
            <div className="loginViewDiv">
                <div className="loginWelcomeMsg"><span>Welcome to Jennings Games!</span></div>
                <div className="loginInstructionMsg"><span>Please login to continue</span></div>
                <form onSubmit={this.handleSubmit}>
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
                            type="text"
                            id="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange} />
                        <div className="loginBtnDiv">
                            <input className="loginSubmitBtn" type="submit" value="Login"/>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;