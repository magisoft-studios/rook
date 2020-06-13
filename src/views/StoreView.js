import React, { Component } from "react";
import '../css/StoreView.scss';

class StoreView extends Component {
    render() {
        return (
            <div className="homeDiv">
                <div className="storeViewTitleDiv">
                    <h2>Coming soon...</h2>
                </div>
                <div className="storeViewGameDiv">
                    <div className="storeViewGameTitleDiv">
                        <span className="storeViewGameTitle">Route 66</span>
                    </div>
                    <div className="storeViewGameLineDiv">
                        <img className="storeViewGameImage" src={process.env.PUBLIC_URL + '/cardcover.png'} alt="Route 66" />
                        <div className="storeViewGameDescDiv">
                            <span className="storeViewGameText">Take a fun and exciting adventure down historic Route 66
                                in this new 3 to 5 player card game.</span>
                        </div>
                    </div>
                    <div className="storeViewGameLineDiv">
                        <div className="storeViewGameDescDiv">
                            <span className="storeViewGameText">Remember some of your favorite classic cars.</span>
                            <img className="storeViewGameInTextImage" src={process.env.PUBLIC_URL + '/chevycorvette.png'} alt="Corvette" />
                        </div>
                    </div>
                    <div className="storeViewGameLineDiv">
                        <div className="storeViewGameDescDiv">
                            <img className="storeViewGameInTextImage" src={process.env.PUBLIC_URL + '/outofgas.png'} alt="OutofGas" />
                            <span className="storeViewGameText">Cause trouble for other players if that's your style.</span>
                        </div>
                    </div>
                    <div className="storeViewGameLineDiv">
                        <div className="storeViewGameDescDiv">
                            <span className="storeViewGameText">Visit some classic Route 66 tourist traps along the way.</span>
                            <img className="storeViewGameInTextImage" src={process.env.PUBLIC_URL + '/whale.png'} alt="Whale" />
                        </div>
                    </div>
                    <div className="storeViewGameLineDiv">
                        <div className="storeViewGameDescDiv">
                            <span className="storeViewGameText">And a whole lot more!!!</span>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default StoreView;