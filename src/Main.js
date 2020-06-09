import React, { Component } from 'react'
import {
    Route,
    NavLink,
    HashRouter,
    Redirect
} from "react-router-dom";
import adapter from 'webrtc-adapter';
import { AppContext } from './ContextLib';
import LoginView from './views/LoginView';
import HomeView from './views/HomeView';
import LobbyView from './views/LobbyView';
import StoreView from './views/StoreView';
import GuidesView from './views/GuidesView';
import ReviewsView from './views/ReviewsView';
import TestView from './views/TestView';
import images from "./Images";
import Session from './Session';
import Game from './Game';

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
            showGameWindow: false,
            redirectToGame: false,
            gameData: null
        }
    }

    handleLogin = (reply) => {
        let session = new Session();
        session.loggedIn = true;
        session.id = reply.sessionId;
        session.playerId = reply.playerId;
        session.playerName = reply.playerName;
        this.setState({ session: session });
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

    handleEnterGame = async (gameData, playerPosn) => {
        let session = this.state.session;
        session.currentGame = {
            id: gameData.id,
            playerPosn: playerPosn,
        }
        this.setState({
            ...this.state,
            session: session,
            showGameWindow: true,
            redirectToGame: true,
            gameData: gameData,
        });
    }

    openTestGame = async (user, posn) => {
        let session = new Session({
            loggedIn: true,
            id: user,
            playerId: user,
            playerName: user,
            currentGame: {
                id: "TestGame",
                playerPosn: posn,
            }
        });

        this.setState({ session: session }, async () => {
            let gameData = await this.getGameData();
            this.setState({
                ...this.state,
                session: session,
                showGameWindow: true,
                redirectToGame: true,
                gameData: gameData,
            });
        });
    }

    render() {
        let session = this.state.session;
        let gameWindow = null;
        let gameMenuItem = null;
        let gameRoute = null;
        let game = null;
        let gameRedirect = null;
        if (this.state.showGameWindow) {
            game = <Game
                sessionId={session.id}
                gameId={session.currentGame.id}
                playerPosn={session.currentGame.playerPosn}
                gameData={this.state.gameData}/>;
            gameMenuItem = <li className="mainMenuItem"><NavLink to="/game">Game</NavLink></li>;
            gameRoute = <Route path="/game">{game}</Route>;

            if (this.state.redirectToGame) {
                gameRedirect = <Redirect to={'/game'} />
            }
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
                    {gameRedirect}
                </div>
            );
        } else {
            contentArea = (
                <LoginView onLogin={this.handleLogin}/>
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