import React, { Component, useState } from 'react'
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";
import { AppContext } from './ContextLib';
import LoginView from './views/LoginView';
import HomeView from './views/HomeView';
import LobbyView from './views/LobbyView';
import StoreView from './views/StoreView';
import GuidesView from './views/GuidesView';
import ReviewsView from './views/ReviewsView';
import TestView from './views/TestView';
import images from "./Images";
import NewWindow from 'react-new-window';
import Session from './Session';
import Game from './Game';

const AUTO_LOGIN = false;
const TEST = false;

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
                    console.log("LoginView success");
                    let session = new Session();
                    session.loggedIn = true;
                    session.id = jsonResp.rookResponse.sessionId;
                    session.playerId = jsonResp.rookResponse.playerId;
                    session.playerName = jsonResp.rookResponse.playerName;
                    this.setState({ session: session });
                } else {
                    alert("LoginView failed: " + jsonResp.rookResponse.errorMsg);
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
                    gameData={this.state.gameData}/>;
            gameMenuItem = <li className="mainMenuItem"><NavLink to="/game">Game</NavLink></li>;
            gameRoute = <Route path="/game">{game}</Route>;
        }

        let testRoute = null;
        let testMenuItem = null;
        if (TEST) {
            testRoute = (
                <Route path="/test">
                    <TestView openTestGame={this.openTestGame} />
                </Route>
            )
            testMenuItem = <li className="mainMenuItem"><NavLink to="/test">Test</NavLink></li>;
        }

        let contentArea = null;
        if (session.loggedIn) {
            contentArea = (
                <div className="contentArea">
                    <Route exact path="/">
                        <HomeView/>
                    </Route>
                    <Route path="/store">
                        <StoreView/>
                    </Route>
                    <Route path="/guides">
                        <GuidesView/>
                    </Route>
                    <Route path="/reviews">
                        <ReviewsView/>
                    </Route>
                    <Route path="/lobby">
                        <LobbyView onEnterGame={this.handleEnterGame}/>
                    </Route>
                    {testRoute}
                    {gameRoute}
                </div>
            );
        } else {
            contentArea = (
                <LoginView onSubmit={this.handleLogin}/>
            );
        }

        return (
            <AppContext.Provider value={session}>
                <HashRouter>
                    <div className="mainPage">
                        <div className="topPageArea">
                            <div className="logoContainer">
                                <div className="logoIconContainer">
                                    <img className="logoImage" src={images.logo} alt="Jennings Gaming"></img>
                                </div>
                                <div className="logoTextContainer">
                                    <span className="logoJenningsText">Jennings</span>
                                    <span className="logoGamingText">Gaming</span>
                                </div>
                            </div>
                            <div className="mainMenu">
                                <ul className="mainMenuHeader">
                                    <li className="mainMenuItem"><NavLink to="/" exact>Home</NavLink></li>
                                    <li className="mainMenuItem"><NavLink to="/store">Store</NavLink></li>
                                    <li className="mainMenuItem"><NavLink to="/guides">Guides</NavLink></li>
                                    <li className="mainMenuItem"><NavLink to="/reviews">Reviews</NavLink></li>
                                    <li className="mainMenuItem"><NavLink to="/lobby">Lobby</NavLink></li>
                                    {testMenuItem}
                                    {gameMenuItem}
                                </ul>
                            </div>
                        </div>
                        <div className="mainView">
                            {contentArea}
                        </div>
                    </div>
                </HashRouter>
                {gameWindow}
            </AppContext.Provider>
        );
    }
}

export default Main;