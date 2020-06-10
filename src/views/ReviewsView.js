import React, { Component } from "react";

class ReviewsView extends Component {
    render() {
        return (
            <div className="reviewViewContentDiv">
                <div className="reviewViewTitleDiv">
                    <h2>Here are our completely unbought and unbossed opinions of games we actually play.</h2>
                </div>
                <div className="reviewViewReviewMainDiv">
                    <div className="reviewViewReviewDiv">
                        <img className="reviewViewGameImage" src={process.env.PUBLIC_URL + '/unityofcommand2.png'} alt="Unity of Command 2" />
                        <div className="reviewViewReviewContentsDiv">
                            <span className="reviewViewGameTitle">Unity of Command 2.</span>
                            <span className="reviewViewGameText">A fresh take on the World War 2 tactical war game genre.</span>
                            <p></p>
                            <span className="reviewViewGameText">Full review coming soon...</span>
                        </div>
                    </div>
                </div>
                <div className="reviewViewReviewMainDiv">
                    <div className="reviewViewReviewDiv">
                        <img className="reviewViewGameImage" src={process.env.PUBLIC_URL + '/orderofbattle.png'} alt="Order of Battle" />
                        <div className="reviewViewReviewContentsDiv">
                            <span className="reviewViewGameTitle">Order of Battle - World War 2</span>
                            <span className="reviewViewGameText">One of the best tactical World War 2 war games you will find.</span>
                            <p></p>
                            <span className="reviewViewGameText">Full review coming soon....</span>
                        </div>
                    </div>
                </div>
                <div className="reviewViewTextDiv">
                    <span className="reviewViewText">More on the way...</span>
                </div>
                <div className="reviewViewStatementDiv">
                    <h2>Our commitment</h2>
                    <p>
                        Our commitment to you is to always give you the straight scoop as we see it and never
                        to pull any punches.  All the games we review land somewhere along the spectrum we call
                        the Herometer.  The Herometer goes from a 10 (Hero) game at the high end to a 0 (Piece of Crap)
                        game on the low end.
                    </p>
                    <p>
                        We recognize that no developer sets out to produce a piece of crap game.  But sometimes,
                        due to many circumstances such as lack of resources, budget, time, or simply a poor execution
                        on a vision, it happens.  When it does, we will let you know.
                    </p>
                    <p>
                        And when magic happens, we consider the developers and executives that made it happen to be Heroes.
                        And we will do everything we can to give them the recognition they deserve. A job well done is a beautiful thing
                        and helps spread joy throughout the world!
                    </p>
                </div>
            </div>
        );
    }
}

export default ReviewsView;