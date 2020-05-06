import React, { Component, useState } from 'react'
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";
import Login from './Login';
import Home from './Home';
import Lobby from './Lobby';
import Game from './Game';
import images from "./Images";
import { AppContext, useAppContext } from './ContextLib';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionInfo: {
                isLoggedIn: false,
                sessionId: "",
                playerId: "",
                playerName: "",
            }
        }
    }

    handleLogin = (userId, password) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userId,
                password: password
            })
        };
        fetch('/rook/login', requestOptions)
            .then(res => res.json())
            .then(res => {
                //alert("got response: " + JSON.stringify(res));
                if (res.rookResponse.status === "SUCCESS") {
                    this.setState({
                        sessionInfo: {
                            isLoggedIn: true,
                            sessionId: res.rookResponse.sessionId,
                            playerId: res.rookResponse.playerId,
                            playerName: res.rookResponse.playerName,
                        }
                    });
                } else {
                    alert("Login failed: " + res.rookResponse.errorMsg);
                    this.setState({
                        sessionInfo: {
                            isLoggedIn: false,
                            sessionId: "",
                            playerId: "",
                            playerName: "",
                         }
                    });
                }
            });
    }

    render() {
        if (this.state.sessionInfo.isLoggedIn) {
            return (
                <AppContext.Provider value={this.state.sessionInfo}>
                    <HashRouter>
                        <div className="mainPage">
                            <div className="mainView">
                                <div className="mainMenu">
                                    <div className="mainMenuLogoDiv">
                                        <div className="logoContainer">
                                            <img className="logo" src={images.logo} alt="Jennings Games"></img>
                                            <span className="logoJennings">Jennings</span>
                                            <span className="logoGames">Games</span>
                                        </div>
                                    </div>
                                    <ul className="mainMenuHeader">
                                        <li className="mainMenuItem"><NavLink to="/" exact>Home</NavLink></li>
                                        <li className="mainMenuItem"><NavLink to="/lobby">Lobby</NavLink></li>
                                        <li className="mainMenuItem"><NavLink to="/game">Game</NavLink></li>
                                    </ul>
                                </div>
                                <div className="contentArea">
                                    <Route exact path="/" component={Home}/>
                                    <Route path="/lobby" component={Lobby}/>
                                    <Route path="/game" component={Game}/>
                                </div>
                            </div>
                        </div>
                    </HashRouter>
                </AppContext.Provider>
            )
        } else {
            return (
                <div className="mainPage">
                    <div className="mainView">
                        <div className="mainMenu">
                            <div className="mainMenuLogoDiv">
                                <div className="logoContainer">
                                    <img className="logo" src={images.logo} alt="Jennings Games"></img>
                                    <span className="logoJennings">Jennings</span>
                                    <span className="logoGames">Games</span>
                                </div>
                            </div>
                        </div>
                        <div className="contentArea">
                            <Login onSubmit={this.handleLogin}/>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

/*
    <div className="menuButtonsDiv">
                                <div className="mainMenuItem"><NavLink className="menuItemNavLink" exact to="/">Home</NavLink></div>
                                <div className="mainMenuItem"><NavLink className="menuItemNavLink" to="/lobby">Lobby</NavLink></div>
                            </div>

 */
export default Main;