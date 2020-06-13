import React, { Component } from "react";
import '../css/ReviewsView.scss';

class ReviewsView extends Component {
    render() {
        return (
            <div className="reviewsViewContentDiv">
                <div className="reviewsViewTitleDiv">
                    <h2>Here are our completely unbought and unbossed opinions of games we actually play.</h2>
                </div>
                <div className="reviewsViewReviewMainDiv">
                    <div className="reviewsViewReviewDiv">
                        <img className="reviewsViewGameImage" src={process.env.PUBLIC_URL + '/unityofcommand2.png'} alt="Unity of Command 2" />
                        <div className="reviewsViewReviewContentsDiv">
                            <span className="reviewsViewGameTitle">Unity of Command 2.</span>
                            <span className="reviewsViewGameText">A fresh take on the World War 2 tactical war game genre.</span>
                            <p></p>
                            <span className="reviewsViewGameText">Full review coming soon...</span>
                        </div>
                    </div>
                </div>
                <div className="reviewsViewReviewMainDiv">
                    <div className="reviewsViewReviewDiv">
                        <img className="reviewsViewGameImage" src={process.env.PUBLIC_URL + '/orderofbattle.png'} alt="Order of Battle" />
                        <div className="reviewsViewReviewContentsDiv">
                            <span className="reviewsViewGameTitle">Order of Battle - World War 2</span>
                            <span className="reviewsViewGameText">One of the best tactical World War 2 war games you will find.</span>
                            <p></p>
                            <span className="reviewsViewGameText">Full review coming soon....</span>
                        </div>
                    </div>
                </div>
                <div className="reviewsViewTextDiv">
                    <span className="reviewsViewText">More on the way...</span>
                </div>
            </div>
        );
    }
}

export default ReviewsView;