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
const TEST = true;
const TEST_USER = "Tom";
const TEST_PLAYER_POSN = "player1";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            session: new Session(),
            gameData: null
        }
    }

    componentDidMount() {
        if (TEST) {
            let session = new Session({
                loggedIn: true,
                id: TEST_USER,
                playerId: TEST_USER,
                playerName: TEST_USER,
                showGameWindow: true,
                currentGame: {
                    id: "TestGame",
                    playerPosn: TEST_PLAYER_POSN,
                }
            });

            this.setState({ session: session });
        } else if (AUTO_LOGIN) {
            this.handleLogin(TEST_USER, "secret");
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

    getGameData = async () => {
        let session = this.state.session;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: session.id,
            })
        };
        try {
            const response = await fetch('/rook/getGameData', requestOptions);
            if (!response.ok) {
                throw Error(response.statusText);
            } else {
                const jsonResp = await response.json();
                let status = jsonResp.rookResponse.status;
                if (status === "SUCCESS") {
                    return jsonResp.rookResponse.gameData
                } else {
                    alert("Could not find game: " + jsonResp.rookResponse.errorMsg);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    playerEnterGame = async () => {
        let session = this.state.session;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: session.id,
            })
        };
        try {
            const response = await fetch('/rook/playerEnterGame', requestOptions);
            if (!response.ok) {
                throw Error(response.statusText);
            } else {
                const jsonResp = await response.json();
                let status = jsonResp.rookResponse.status;
                if (status === "SUCCESS") {
                    return jsonResp.rookResponse.gameData
                } else {
                    alert("Could not find game: " + jsonResp.rookResponse.errorMsg);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleEnterGame = async (gameName, playerPosn) => {
        let gameData = await this.playerEnterGame();
        let session = this.state.session;
        session.showGameWindow = true;
        session.currentGame = {
            id: gameName,
            playerPosn: playerPosn,
        }
        this.setState({
            ...this.state,
            session: session,
            gameData: gameData,
        });
    }

    openTestGame = async () => {
        let gameData = await this.getGameData();
        let session = this.state.session;
        session.showGameWindow = true;
        session.currentGame = {
            id: gameData.name,
            playerPosn: TEST_PLAYER_POSN,
        }
        this.setState({
            ...this.state,
            session: session,
            gameData: gameData,
        });
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
                        playerPosn={session.currentGame.playerPosn}
                        gameData={this.state.gameData} />
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
                                        <Home openTestGame={this.openTestGame}/>
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