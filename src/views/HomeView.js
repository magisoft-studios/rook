import React, { Component } from "react";
import { Link } from 'react-router-dom';

class HomeView extends Component {
    render() {
        return (
            <div className="homeDiv">
                <h2>Welcome to Jennings Gaming</h2>
                <span className="missionText">Our mission is to spread happiness around the world through the enjoyment of gaming!</span>
                <div className="homeViewLinksSection">
                    <div className="homeViewSection">
                        <div className="homeViewLine">
                            <Link className="homeViewLink" to='/store'>
                                <img className="homeViewLinkImage" src={process.env.PUBLIC_URL + '/store.png'} />
                            </Link>
                            <span className="homeViewText">To check out our collection of gaming products, check out our</span>
                            <Link className="homeViewLink" to='/store'>Store</Link>
                            <span className="homeViewText">page</span>
                        </div>
                    </div>
                    <div className="homeViewSection">
                        <div className="homeViewLine">
                            <Link className="homeViewLink" to='/guides'>
                                <img className="homeViewLinkImage" src={process.env.PUBLIC_URL + '/wizard.png'} />
                            </Link>
                            <span className="homeViewText">To get some helpful info on our favorite games, step into our</span>
                            <Link className="homeViewLink" to='/guides'>Guides</Link>
                            <span className="homeViewText">page</span>
                        </div>
                    </div>
                    <div className="homeViewSection">
                        <div className="homeViewLine">
                            <Link className="homeViewLink" to='/reviews'>
                                <img className="homeViewLinkImage" src={process.env.PUBLIC_URL + '/reviews.png'} />
                            </Link>
                            <span className="homeViewText">To find out our opinions of games, feel free to explore our</span>
                            <Link className="homeViewLink" to='/reviews'>Reviews</Link>
                            <span className="homeViewText">page</span>
                        </div>
                    </div>
                    <div className="homeViewSection">
                        <div className="homeViewLine">
                            <Link className="homeViewLink" to='/lobby'>
                                <img className="homeViewLinkImage" src={process.env.PUBLIC_URL + '/card-game.png'} />
                            </Link>
                            <span className="homeViewText">To play one of our online games with your friends, pop on into our</span>
                            <Link className="homeViewLink" to='/lobby'>Game Lobby</Link>
                            <span className="homeViewText">page</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HomeView;