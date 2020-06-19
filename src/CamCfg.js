import React, { Component } from 'react'
import AppContext from './ContextLib';
import Cam from './Cam.js';
import './css/CamCfg.scss';
import MyButton from './MyButton';

class CamCfg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoSrc: "",
            audioSrc: "",
            audioDst: "",
            initStream: true,
            mediaStream: null,
            videoSrcOptions: [],
            audioSrcOptions: [],
            audioDstOptions: [],
            showFirefoxAdvice: false,
        };
        this.videoSrcInput = React.createRef();
        this.audioSrcInput = React.createRef();
        this.audioDstInput = React.createRef();
    }

    componentDidMount = async () => {
        console.log("CamCfg: mounted");
    }

    componentDidUpdate(prevProps, prevState) {
        if ((this.state.mediaStream != null) && (prevState.mediaStream == null)) {
            this.enumerateDevices();
        }
    }

    componentWillUnmount = () => {
        console.log("CamCfg: unmounting");
    }

    handleVideoSrcChange = (event) => {
        this.setState({videoSrc: event.target.value});
    }

    handleAudioSrcChange = (event) => {
        this.setState({audioSrc: event.target.value});
    }

    handleAudioDstChange = (event) => {
        this.setState({audioDst: event.target.value});
    }

    handleAddStream = (posn, mediaStream) => {
        console.log(`CamCfg::handleAddStream`);
        let newState = { ...this.state };
        newState.streams[posn] = mediaStream;
        console.log(`Game::handleAddStream: adding media stream: ${mediaStream.id}`);
        this.setState(newState);
    }

    handleStreamIsReady = (mediaStream) => {
        console.log(`CamCfg::handleStreamIsReady`);
        this.setState({
            mediaStream: mediaStream,
            initStream: false,
        });
    }

    handleApplyCfg = async () => {
        console.log(`CamCfg::handleApplyCfg`);
        if (this.state.mediaStream != null) {
            this.state.mediaStream.getTracks().forEach(track => {
                track.stop();
            });
        }

        let videoSrc = this.videoSrcInput.current.value;
        let audioSrc = this.audioSrcInput.current.value;
        let audioDst = this.audioDstInput.current.value;

        this.props.cookies.set("VideoSource", videoSrc, {path: '/'} );
        this.props.cookies.set("AudioSource", audioSrc, {path: '/'} );
        this.props.cookies.set("AudioDest", audioDst, {path: '/'} );

        this.context.updateMediaSettings( {
            videoSrc: videoSrc,
            audioSrc: audioSrc,
            audioDst: audioDst,
        });

        this.setState( {
            initStream: true,
            mediaStream: null,
            videoSrc: videoSrc,
            audioSrc: audioSrc,
            audioDst: audioDst,
        });
    }

    handleReload = () => {
        console.log(`CamCfg::handleReloadSources`);
        this.enumerateDevices();
    }

    enumerateDevices = async () => {
        console.log('enumerateDevices');
        try {
            let videoSrcOptions = [];
            let audioSrcOptions = [];
            let audioDstOptions = [];
            let deviceInfoList = await navigator.mediaDevices.enumerateDevices();
            deviceInfoList.forEach( (deviceInfo) => {
                console.log(`Found device info kind: ${deviceInfo.kind}, label ${deviceInfo.label}, id: ${deviceInfo.deviceId}`);
                switch (deviceInfo.kind) {
                    case 'videoinput': {
                        let optionText = deviceInfo.label || `camera ${videoSrcOptions.length + 1}`;
                        let option = <option key={optionText} value={deviceInfo.deviceId}>{optionText}</option>;
                        videoSrcOptions.push(option);
                        break;
                    }
                    case 'audioinput': {
                        let optionText = deviceInfo.label || `microphone ${audioSrcOptions.length + 1}`;
                        let option = <option key={optionText} value={deviceInfo.deviceId}>{optionText}</option>;
                        audioSrcOptions.push(option);
                        break;
                    }
                    case 'audiooutput': {
                        let optionText = deviceInfo.label || `speaker ${audioDstOptions.length + 1}`;
                        let option = <option key={optionText} value={deviceInfo.deviceId}>{optionText}</option>;
                        audioDstOptions.push(option);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });

            this.setState( {
                initStream: false,
                videoSrcOptions: videoSrcOptions,
                audioSrcOptions: audioSrcOptions,
                audioDstOptions: audioDstOptions,
            })
        } catch (error) {
            console.log(`CamCfg:: enumerateDevices error: ${error}`);
        }
    }

    showFirefoxAdvice = () => {
         this.setState( {
             showFirefoxAdvice: true,
         });
    }

    hideFirefoxAdvice = () => {
        this.setState( {
            showFirefoxAdvice: false,
        });
    }

    render() {
        let curVideoSrc = this.state.videoSrc;
        if (curVideoSrc.length === 0) {
            curVideoSrc = this.context.mediaSettings.videoSrc;
        }

        let curAudioSrc = this.state.audioSrc;
        if (curAudioSrc.length === 0) {
            curAudioSrc = this.context.mediaSettings.audioSrc;
        }

        let curAudioDst = this.state.audioDst;
        if (curAudioDst.length === 0) {
            curAudioDst = this.context.mediaSettings.audioDst;
        }

        return (
            <div className="camCfgDiv">
                <div className="camCfgTitleDiv">
                    <span className="camCfgTitle">Audio/Video Configuration</span>
                </div>
                <div className="camCfgOptionDiv">
                    <label className="camCfgOptionLabel" htmlFor="videoSrcInput">Video Input Source (WebCam)</label>
                    <select
                        ref={this.videoSrcInput}
                        className="camCfgOptionSelect"
                        id="videoSrcInput"
                        name="videoSrcInput"
                        value={curVideoSrc}
                        onChange={this.handleVideoSrcChange}>
                        {this.state.videoSrcOptions}
                    </select>
                </div>
                <div className="camCfgOptionDiv">
                    <label className="camCfgOptionLabel" htmlFor="audioSrcInput">Audio Input Source (Microphone)</label>
                    <select
                        ref={this.audioSrcInput}
                        className="camCfgOptionSelect"
                        id="audioSrcInput"
                        name="audioSrcInput"
                        value={curAudioSrc}
                        onChange={this.handleAudioSrcChange}>
                        {this.state.audioSrcOptions}
                    </select>
                </div>
                <div className="camCfgOptionDiv">
                    <label className="camCfgOptionLabel" htmlFor="audioDstInput">Audio Output (Speakers/Headset)</label>
                    <select
                        ref={this.audioDstInput}
                        className="camCfgOptionSelect"
                        id="audioDstInput"
                        name="audioDstInput"
                        value={curAudioDst}
                        onChange={this.handleAudioDstChange}>
                        {this.state.audioDstOptions}
                    </select>
                </div>
                <div className="camCfgAudioOutAdviceDiv">
                    <span
                        className="camCfgAudioOutAdviceText"
                        onMouseOver={() => this.showFirefoxAdvice()}
                        onMouseOut={() => this.hideFirefoxAdvice()}
                        >(Firefox configuration details...)
                    </span>
                </div>
                { this.state.showFirefoxAdvice ?
                    <div className="camCfgFirefoxAdviceDiv">
                        <span className="camCfgFirefoxCfgText">1. Enter 'about:config' in address bar</span>
                        <span className="camCfgFirefoxCfgText">2. Search for configuration 'media.setsinkid.enabled'</span>
                        <span className="camCfgFirefoxCfgText">3. Set value to 'true'</span>
                    </div>
                    : null
                }
                <div className="camCfgCtrlPnlDiv">
                    <MyButton
                        btnClass="camCfgApplyCfgBtn"
                        btnText="Reload Source Choices"
                        onClick={() => this.handleReload()}>
                    </MyButton>
                    <MyButton
                        btnClass="camCfgApplyCfgBtn"
                        btnText="Apply Configuration"
                        onClick={() => this.handleApplyCfg()}>
                    </MyButton>
                </div>
                <div className="camCfgCamDiv">
                    <Cam
                        name="playerCam"
                        initStream={this.state.initStream}
                        mediaStream={this.state.mediaStream}
                        videoSrc={curVideoSrc}
                        audioSrc={curAudioSrc}
                        audioDst={curAudioDst}
                        onStreamReady={this.handleStreamIsReady} />
                </div>
                <div className="camCfgAdviceDiv">
                    <span className="camCfgAdviceText">*To enable sound you may need to click on the video and unmute</span>
                </div>
            </div>
        );
    }
}

CamCfg.contextType = AppContext;

export default CamCfg;
