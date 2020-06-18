import React, { Component } from 'react'

class RemoteCam extends Component {
    constructor(props) {
        super(props);
        this.videoEleRef = React.createRef();
        this.state = {
            mediaStream: props.mediaStream,
        }
    }

    /*
    static getDerivedStateFromProps(nextProps, prevState) {
        if ((prevState.mediaStream == null) && (nextProps.mediaStream != null)) {
            return { mediaStream: nextProps.mediaStream };
        } else {
            return null;
        }
    }
*/
    componentDidUpdate(prevProps) {
        if (this.props.mediaStream != prevProps.mediaStream) {
            this.updateMediaStream(this.props.mediaStream);
        }
    }

    updateMediaStream = (mediaStream) => {
        console.log(`RemoteCam[${this.props.name} updateMediaStream called`);
        try {
            var videoEle = this.videoEleRef.current;
            if (mediaStream != null) {
                console.log(`RemoteCam[${this.props.name}] setting video source object to ${mediaStream.id}`);
                videoEle.srcObject = mediaStream;
            } else {
                console.log(`mediaStream object is null, trying to get existing stream and remove tracks`);
                let stream = videoEle.srcObject;
                if (stream != null) {
                    console.log('stream is not null, removing tracks')
                    let tracks = stream.getTracks();
                    tracks.forEach( (track) => {
                        track.stop();
                    });
                }
                videoEle.srcObject = null;
                //videoEle.display = 'none';
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
