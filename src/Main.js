import React, { Component } from 'react'
import {
    Route,
    NavLink,
    HashRouter
} from "react-router-dom";
import Home from './Home';
import Lobby from './Lobby';
import Game from './Game';
import images from "./Images";

class Main extends Component {
    render() {
        return (
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
        );
    }
}

/*
    <div className="menuButtonsDiv">
                                <div className="mainMenuItem"><NavLink className="menuItemNavLink" exact to="/">Home</NavLink></div>
                                <div className="mainMenuItem"><NavLink className="menuItemNavLink" to="/lobby">Lobby</NavLink></div>
                            </div>

 */
export default Main;