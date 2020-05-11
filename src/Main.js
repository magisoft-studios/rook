import React, { Component, useState } from 'react'
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";
import { AppContext } from './ContextLib';
import Login from './Login';
import Home from './Home';
import Lobby from './Lobby';
import images from "./Images";
import NewWindow from 'react-new-window';
import Session from './Session';
import Game from './Game';

const AUTO_LOGIN = false;
const TEST = false;

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: new Session()
        }
    }

    componentDidMount() {
        if (TEST) {
            let session = new Session({
                loggedIn: true,
                id: "Tom",
                playerId: "Tom",
                playerName: "Tom",
                showGameWindow: true,
                currentGame: {
                    id: "TestGame",
                    playerPosn: "player1"
                }
            });

            this.setState({ session: session });
        } else if (AUTO_LOGIN) {
            this.handleLogin("Tom", "secret");
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
                    let session = new Session();
                    session.loggedIn = true;
                    session.id = res.rookResponse.sessionId;
                    session.playerId = res.rookResponse.playerId;
                    session.playerName = res.rookResponse.playerName;
                    this.setState({ session: session });
                } else {
                    alert("Login failed: " + res.rookResponse.errorMsg);
                    this.setState({ session: new Session() });
                }
            });
    }

    handleEnterGame = (gameName, playerPosn) =>{
        let session = this.state.session;
        session.showGameWindow = true;
        session.currentGame = {
            id: gameName,
            playerPosn: playerPosn,
        }
        this.setState({ session: session });
    }

    render() {
        let session = this.state.session;
        if (session.loggedIn) {
            let gameWindow = null;
            if (session.showGameWindow) {
                gameWindow = <NewWindow
                    features="width=100%,height=100%"
                    copyStyles={true}
                    center="screen">
                    <Game
                        gameId={session.currentGame.id}
                        playerPosn={session.currentGame.playerPosn}/>
                </NewWindow>;
            }

            return (
                <AppContext.Provider value={session}>
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
                                    </ul>
                                </div>
                                <div className="contentArea">
                                    <Route exact path="/">
                                        <Home onEnterGame={this.handleEnterGame}/>
                                    </Route>
                                    <Route path="/lobby">
                                        <Lobby onEnterGame={this.handleEnterGame}/>
                                    </Route>
                                </div>
                            </div>
                        </div>
                    </HashRouter>
                    {gameWindow}
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

export default Main;