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

class Main extends Component {
    constructor(props) {
        super(props);
        let session = new Session();
        if (TEST) {
            session.loggedIn = true;
        }
        this.state = {
            session: session,
            gameData: null
        }
    }

    componentDidMount() {
    }

    handleLogin = async (userId, password) => {
        console.log("handleLogin START");
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: userId,
                password: password
            })
        };
        try {
            const response = await fetch('/rook/login', requestOptions);
            if (!response.ok) {
                throw Error(response.statusText);
            } else {
                const jsonResp = await response.json();
                let status = jsonResp.rookResponse.status;
                if (status === "SUCCESS") {
                    console.log("Login success");
                    let session = new Session();
                    session.loggedIn = true;
                    session.id = jsonResp.rookResponse.sessionId;
                    session.playerId = jsonResp.rookResponse.playerId;
                    session.playerName = jsonResp.rookResponse.playerName;
                    this.setState({ session: session });
                } else {
                    alert("Login failed: " + jsonResp.rookResponse.errorMsg);
                    this.setState({ session: new Session() });
                }
            }
        } catch (error) {
            console.log(error);
        }
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

    openTestGame = async (user, posn) => {
        let session = new Session({
            loggedIn: true,
            id: user,
            playerId: user,
            playerName: user,
            showGameWindow: false,
            currentGame: {
                id: "TestGame",
                playerPosn: posn,
            }
        });

        this.setState({ session: session }, async () => {
            let gameData = await this.getGameData();
            session.showGameWindow = true;
            this.setState({
                ...this.state,
                session: session,
                gameData: gameData,
            });
        });
    }

    render() {
        let session = this.state.session;
        if (session.loggedIn) {
            let gameWindow = null;
/*
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
*/

            let gameMenuItem = null;
            let gameRoute = null;
            let game = null;
            if (session.showGameWindow) {
                game =
                    <Game
                        gameId={session.currentGame.id}
                        playerPosn={session.currentGame.playerPosn}
                        gameData={this.state.gameData} />;
                gameMenuItem = <li className="mainMenuItem"><NavLink to="/game">Game</NavLink></li>;
                gameRoute = <Route path="/game">{game}</Route>;
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
                                            <span className="logoGames">Gaming</span>
                                        </div>
                                    </div>
                                    <ul className="mainMenuHeader">
                                        <li className="mainMenuItem"><NavLink to="/" exact>Home</NavLink></li>
                                        <li className="mainMenuItem"><NavLink to="/lobby">Lobby</NavLink></li>
                                        {gameMenuItem}
                                    </ul>
                                </div>
                                <div className="contentArea">
                                    <Route exact path="/">
                                        <Home openTestGame={this.openTestGame}/>
                                    </Route>
                                    <Route path="/lobby">
                                        <Lobby onEnterGame={this.handleEnterGame}/>
                                    </Route>
                                    {gameRoute}
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