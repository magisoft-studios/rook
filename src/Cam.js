import React, { Component } from 'react'
import GameStates from './GameStates';

class Cam extends Component {
    constructor(props) {
        super(props);
        this.videoEleRef = React.createRef();
        this.state = {
            mediaStream: props.mediaStream,
        };
    }

    componentDidMount = async () => {
        if (this.props.initStream) {
            this.initStream();
        }
    }

    componentDidUpdate(prevProps) {
        if ((prevProps.initStream === false) && (this.props.initStream === true)) {
            this.initStream();
        }
    }

    componentWillUnmount() {
        this.clear();
    }

    clear = () => {
        var videoEle = this.videoEleRef.current;
        let stream = videoEle.srcObject;
        if (stream != null) {
            console.log('Cam: stream is not null, removing tracks')
            let tracks = stream.getTracks();
            tracks.forEach( (track) => {
                track.stop();
            });
        }
        videoEle.srcObject = null;
    }

    initStream = async () => {
        console.log(`Cam[${this.props.name}] streamCamVideo`);
        const videoSource = this.props.videoSrc;
        const audioSource = this.props.audioSrc;
        let videoConstraints = {
            width: 150,
            height: 170,
            deviceId: (videoSource.length > 0) ? {exact: videoSource} : undefined,
            facingMode: (videoSource.length > 0) ? undefined : {ideal: 'user'},
        };
        let audioConstraints = {
            deviceId: (audioSource.length > 0) ? {exact: audioSource} : undefined,
        };
        let mediaStreamConstraints = {
            audio: audioConstraints,
            video: videoConstraints,
        };

        console.log(`Cam:initStream: constraints = ${JSON.stringify(mediaStreamConstraints)}`)
        try {
            console.log(`Cam[${this.props.name}] getUserMedia`);
            let mediaStream = await navigator.mediaDevices.getUserMedia(mediaStreamConstraints);
            var videoEle = this.videoEleRef.current;
            videoEle.onloadedmetadata = (e) => {
                console.log(`Cam[${this.props.name}] onloadedmetadata, called`);
                videoEle.play();
                if (this.props.audioDst.length > 0) {
                    videoEle.setSinkId(this.props.audioDst);
                }
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
