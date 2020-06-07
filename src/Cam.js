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
        console.log(`Cam[${this.props.name}] streamCamVideo`);
        var mediaStreamConstraints = { audio: true, video: { width: 150, height: 170 } };
        try {
            console.log(`Cam[${this.props.name}] getUserMedia`);
            let mediaStream = await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
            var videoEle = this.videoEleRef.current;
            videoEle.onloadedmetadata = (e) => {
                console.log(`Cam[${this.props.name}] onloadedmetadata, called`);
                videoEle.play();
                this.props.onStreamReady(mediaStream);
            };
            console.log(`Cam[${this.props.name}] setting media stream on video ele`);
            videoEle.srcObject = mediaStream;
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
                    muted
                    controls>
                </video>
            </div>
        );
    }
}

export default Cam;
