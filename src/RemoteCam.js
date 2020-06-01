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
        console.log(`RemoteCam[${this.props.name}] componentDidUpdate: prevProps = ${JSON.stringify(prevProps)}`);
        console.log(`RemoteCam[${this.props.name}] componentDidUpdate: newProps = ${JSON.stringify(this.props)}`);
        if ((prevProps.mediaStream == null) && (this.props.mediaStream != null)) {
            this.updateMediaStream(this.props.mediaStream);
        }
    }

    updateMediaStream = (mediaStream) => {
        console.log(`RemoteCam[${this.props.name} updateMediaStream called`);
        try {
            if (mediaStream != null) {
                console.log(`RemoteCam[${this.props.name}] setting video source object to ${mediaStream.id}`);
                var videoEle = this.videoEleRef.current;
                videoEle.srcObject = mediaStream;
                //videoEle.onloadedmetadata = function (e) {
                //    videoEle.play();
                //};
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
