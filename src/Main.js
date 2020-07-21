import React, { Component } from 'react';
import {
    Route,
    NavLink,
    HashRouter,
    Redirect
} from "react-router-dom";
import { withCookies } from 'react-cookie';
import adapter from 'webrtc-adapter';
import AppContext from './ContextLib';
import LoginView from './views/LoginView';
import HomeView from './views/HomeView';
import LobbyView from './views/LobbyView';
import StoreView from './views/StoreView';
import GuidesView from './views/GuidesView';
import ReviewsView from './views/ReviewsView';
import TestView from './views/TestView';
import AccountView from './views/AccountView';
import images from "./Images";
import Session from './Session';
import Game from './Game';
import ConnectionTest from './ConnectionTest';
import MyButton from "./MyButton";

const TEST = false;

class Main extends Component {
    constructor(props) {
        super(props);
        console.log(`Main: env = ${process.env.NODE_ENV}`);
        let session = new Session();

        if (TEST) {
            session.loggedIn = true;
        }

        this.state = {
            session: session,
            showGameWindow: false,
            redirectRoute: "/",
            gameData: null,
            mediaSettings: {},
            lastView: "/",
        }

        this.context = {};
    }

    updateMediaSettings = (mediaSettings) => {
        this.setState({
            mediaSettings: mediaSettings,
        });
    }

    handleNav = (viewRoute) => {
        this.setState( {
            redirectRoute: "",
            lastView: viewRoute
        });
    }

    handleSignInBtnClick = () => {
        this.setState({
            redirectRoute: '/login',
        });
    }

    handleSignOutBtnClick = () => {
        this.doLogout();
    }

    handleLogin = (reply) => {
        console.log(`Main:handleLogin: reply=${JSON.stringify(reply)}`);
        let session = new Session();
        session.loggedIn = true;
        session.loginMethod = reply.loginMethod;
        session.id = reply.sessionId;
        session.playerId = reply.playerId;
        session.playerName = reply.playerName;
        session.permissions = reply.permissions;
        session.friends = reply.friends;

        let mediaSettings = {};
        mediaSettings.videoSrc = this.props.cookies.get("VideoSource") || "";
        mediaSettings.audioSrc = this.props.cookies.get("AudioSource") || "";
        mediaSettings.audioDst = this.props.cookies.get("AudioDest") || "";

        this.setState({
            session: session,
            mediaSettings: mediaSettings,
            redirectRoute: this.state.lastView,
        });
    }

    doGoogleLogout = () => {
        console.log("Logging out of google");
        var auth2 = window.gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
    }

    doLogout = async () => {
        let session = this.state.session;

        if (session.loginMethod === "google") {
            this.doGoogleLogout();
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: session.id,
            })
        };
        try {
            const response = await fetch('/user/logout', requestOptions);
            if (!response.ok) {
                const jsonResp = await response.json();
                console.log(`doLogout: response: ${JSON.stringify(jsonResp)}`);
            }
        } catch (error) {
            console.log(error);
        }

        this.setState({
            session: new Session(),
            redirectRoute: '/',
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
                console.log(`Main: getGameData: ${response.statusText}`);
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
            redirectRoute: '/game',
            gameData: gameData,
        });
    }

    handleExitGame = async (gameData, playerPosn) => {
        let session = this.state.session;
        session.currentGame = {
            id: "",
            playerPosn: "",
        }
        this.setState({
            ...this.state,
            session: session,
            showGameWindow: false,
            redirectRoute: '/lobby',
            gameData: null,
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
            },
            permissions: {
                createGame: (posn === "player1") ? true : false,
            }
        });

        this.setState({ session: session }, async () => {
            let gameData = await this.getGameData();
            this.setState({
                ...this.state,
                session: session,
                showGameWindow: true,
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

        if (session.loggedIn && (this.state.showGameWindow)) {
            if ((this.state.gameData.type === "Rook") || (this.state.gameData.type === "Elements")) {
                game = <Game
                    sessionId={session.id}
                    gameId={session.currentGame.id}
                    playerPosn={session.currentGame.playerPosn}
                    gameData={this.state.gameData}
                    onExit={this.handleExitGame}/>;
            } else if (this.state.gameData.type === "ConnectionTest") {
                game = <ConnectionTest
                    sessionId={session.id}
                    gameId={session.currentGame.id}
                    playerPosn={session.currentGame.playerPosn}
                    gameData={this.state.gameData}
                    onExit={this.handleExitGame}/>;
            }
            gameMenuItem =
                <li key="gameMenuItem" className="mainMenuItem">
                    <NavLink to="/game" onClick={() => this.handleNav("/game")}>Game</NavLink>
                </li>;
            gameRoute = <Route key="gameRoute" path="/game">{game}</Route>;
        }

        let mainMenuItems = [];
        let accountMenuItems = [];
        let accountMenuBtns = [];
        let contentAreaItems = [];

        mainMenuItems.push(
            <li key="homeMenuItem" className="mainMenuItem">
                <NavLink to="/" exact onClick={() => this.handleNav('/')}>Home</NavLink>
            </li>);
        mainMenuItems.push(
            <li key="storeMenuItem" className="mainMenuItem">
                <NavLink to="/store" onClick={() => this.handleNav('/store')}>Store</NavLink>
            </li>);
        mainMenuItems.push(
            <li key="guidesMenuItem" className="mainMenuItem">
                <NavLink to="/guides" onClick={() => this.handleNav('/guides')}>Guides</NavLink>
            </li>);
        mainMenuItems.push(
            <li key="reviewsMenuItem" className="mainMenuItem">
                <NavLink to="/reviews" onClick={() => this.handleNav('/reviews')}>Reviews</NavLink>
            </li>);
        mainMenuItems.push(
            <li key="lobbyMenuItem" className="mainMenuItem">
                <NavLink to="/lobby" onClick={() => this.handleNav('/lobby')}>Lobby</NavLink>
            </li>);

        if (TEST) {
            mainMenuItems.push(
                <li key="testMenuItem" className="mainMenuItem">
                    <NavLink to="/test" onClick={() => this.handleNav('/test')}>Test</NavLink>
                </li>);
        }

        if (session.loggedIn) {
            mainMenuItems.push(gameMenuItem);

            accountMenuItems.push(
                <li key="accountMenuItem" className="mainMenuItem">
                    <NavLink to="/account" onClick={() => this.handleNav('/account')}>My Profile</NavLink>
                </li>);
            accountMenuBtns.push(
                <MyButton
                    key="signInMenuItem"
                    btnClass="accountMenuButton"
                    btnText="Sign Out"
                    onClick={this.handleSignOutBtnClick}>
                </MyButton>
            );
        } else {
            accountMenuBtns.push(
                <MyButton
                    key="signOutMenuItem"
                    btnClass="accountMenuButton"
                    btnText="Sign In"
                    onClick={this.handleSignInBtnClick}>
                </MyButton>
            );
        }

        // CONTENT AREA ITEMS

        contentAreaItems.push(<Route key="homeRoute" exact path="/"><HomeView/></Route>);
        contentAreaItems.push(<Route key="storeRoute" path="/store"><StoreView/></Route>);
        contentAreaItems.push(<Route key="guidesRoute" path="/guides"><GuidesView/></Route>);
        contentAreaItems.push(<Route key="reviewsRoute" path="/reviews"><ReviewsView/></Route>);

        if (session.loggedIn) {
            contentAreaItems.push(
                <Route key="lobbyRoute" path="/lobby">
                    <LobbyView cookies={this.props.cookies} onEnterGame={this.handleEnterGame}/>
                </Route>
            );
            contentAreaItems.push(gameRoute);
            contentAreaItems.push(<Route key="accountRoute" path="/account"><AccountView/></Route>);
        } else {
            contentAreaItems.push(<Route key="lobbyRoute" path="/lobby"><LoginView onLogin={this.handleLogin}/></Route>);
            contentAreaItems.push(<Route key="loginRoute" path="/login"><LoginView onLogin={this.handleLogin}/></Route>);
        }

        if (TEST) {
            contentAreaItems.push(<Route key="testRoute" path="/test"><TestView openTestGame={this.openTestGame}/></Route>);
        }

        if (this.state.redirectRoute.length > 0) {
            contentAreaItems.push(<Redirect key="redirectRoute" to={this.state.redirectRoute} />);
        }


        return (
            <AppContext.Provider value={
                {
                    session: this.state.session,
                    mediaSettings: this.state.mediaSettings,
                    updateMediaSettings: this.updateMediaSettings,
                }
            }>
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
                                    {mainMenuItems}
                                </ul>
                            </div>
                            <div className="accountMenu">
                                <ul className="accountMenuHeader">
                                    {accountMenuItems}
                                </ul>
                                {accountMenuBtns}
                            </div>
                        </div>
                        <div className="mainView">
                            <div className="contentArea">
                                {contentAreaItems}
                            </div>
                        </div>
                    </div>
                </HashRouter>
                {gameWindow}
            </AppContext.Provider>
        );
    }
}

export default withCookies(Main);