import React, { Component } from 'react'

class RemoteCam extends Component {
    constructor(props) {
        super(props);
        this.videoEleRef = React.createRef();
        this.state = {
            mediaStream: props.mediaStream,
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.mediaStream != prevProps.mediaStream) {
            this.updateMediaStream(this.props.mediaStream);
        }
    }

    componentWillUnmount() {
        this.clear();
    }

    clear = () => {
        var videoEle = this.videoEleRef.current;
        let stream = videoEle.srcObject;
        if (stream != null) {
            console.log('RemoteCam: stream is not null, removing tracks')
            let tracks = stream.getTracks();
            tracks.forEach( (track) => {
                track.stop();
            });
        }
        videoEle.srcObject = null;
    }

    updateMediaStream = (mediaStream) => {
        console.log(`RemoteCam[${this.props.name} updateMediaStream called`);
        try {
            var videoEle = this.videoEleRef.current;
            if (mediaStream != null) {
                console.log(`RemoteCam[${this.props.name}] setting video source object to ${mediaStream.id}`);
                videoEle.srcObject = mediaStream;
                if (this.props.audioDst.length > 0) {
                    videoEle.setSinkId(this.props.audioDst);
                }
            } else {
                console.log(`mediaStream object is null, trying to get existing stream and remove tracks`);
                this.clear();
            }
        } catch (err) {
            console.log(err.name + ": " + err.message);
        }
    }

    render() {
        return (
            <div className="playerImageDiv">
                <video
                    ref={this.videoEleRef}
                    className="playerImage"
                    autoPlay={true}
                    controls>
                </video>
            </div>
        );
    }
}

export default RemoteCam;
