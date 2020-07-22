import React, { Component } from 'react'
import './css/SessionTimeoutDlg.scss';
import AppContext from "./ContextLib";
import MyButton from "./MyButton";

class SessionTimeoutDlg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeLeft: 10,
        }
        this.timerId = null;
    }

    handleContinueBtn = () => {
        clearTimeout(this.timerId);
        this.props.onContinue();
    }

    handleTimeTick = () => {
        console.log("SessionTimedOutDlg: handleTimeTick");
        let timeLeft = this.state.timeLeft - 1;
        if (timeLeft < 0) {
            this.props.onTimedOut();
        } else {
            this.setState ( {
                timeLeft: timeLeft,
            });
            this.timerId = setTimeout(this.handleTimeTick, 1000);
        }
    }

    componentDidMount = () => {
        console.log("SessionTimedOutDlg: componentDidMount: starting timer");
        this.timerId = setTimeout(this.handleTimeTick, 1000);
    }

    componentWillUnmount = () => {
        console.log("SessionTimedOutDlg: componentWillUnmount: clearing timer");
        clearTimeout(this.timerId);
    }

    render() {
        console.log("SessionTimedOutDlg: render");
        return (
            <div className="sessionTimeoutDlgDiv">
                <span className="sessionTimeoutDlgTitle">Session Timeout Warning</span>
                <span className="sessionTimeoutDlgMsg">Your session will timeout due to inactivity in {this.state.timeLeft} seconds</span>
                <MyButton
                    btnClass="sessionTimeoutDlgContinueBtn"
                    btnText="Continue Session"
                    onClick={this.handleContinueBtn}>
                </MyButton>
            </div>
        );
    }
}

SessionTimeoutDlg.contextType = AppContext;

export default SessionTimeoutDlg;

