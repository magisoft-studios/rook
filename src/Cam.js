import React, { Component } from 'react'
import Game from "./Game";

class Cam extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = async () => {
        await this.streamCamVideo();
    }

    streamCamVideo = async () => {
        var constraints = { audio: true, video: { width: 150, height: 170 } };
        try {
            let mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            var video = document.querySelector("video");
            video.srcObject = mediaStream;
            video.onloadedmetadata = function(e) {
                video.play();
            };
        } catch (err) {
            console.log(err.name + ": " + err.message);
        }
    }

    render() {
        return (
            <div className="playerImageDiv">
                <video className="playerImage" autoPlay={true} id="videoElement" controls></video>
            </div>
        );
    }
}

export default Cam;
