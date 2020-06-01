import React, { Component } from 'react'

class Cam extends Component {
    constructor(props) {
        super(props);
        this.videoEleRef = React.createRef();
        this.state = {
            mediaStream: props.mediaStream,
        };
    }

    componentDidMount = async () => {
        await this.streamCamVideo();
    }

    streamCamVideo = async () => {
        var mediaStreamConstraints = { audio: true, video: { width: 150, height: 170 } };
        try {
            let mediaStream = await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
            var videoEle = this.videoEleRef.current;
            videoEle.srcObject = mediaStream;
            videoEle.onloadedmetadata = (e) => {
                videoEle.play();
                this.props.onStreamReady(mediaStream);
            };
        } catch (error) {
            console.log(`Cam[${this.props.name}] cant get user media: ${error.message}`);
        }
    }

    render() {
        return (
            <div className="playerImageDiv">
                <video
                    ref={this.videoEleRef}
                    className="playerImage"
                    autoPlay={true}
                    playsInline={true}
                    controls>
                </video>
            </div>
        );
    }
}

export default Cam;
