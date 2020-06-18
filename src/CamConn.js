import SocketMsg from './SocketMsg';

class CamConn {
    constructor(params) {
        this.sessionId = params.sessionId;
        this.name = params.name;
        this.playerPosn = params.playerPosn;
        this.peerPosn = params.peerPosn;
        this.gameData = params.gameData;
        this.peerConn = null;
        this.sendSocketMessage = params.sendMessage;
        this.handleAddStream = params.handleAddStream;
        this.handleConnected = params.handleConnected;
        this.mediaStream = null;
        this.connecting = false;
        this.connected = false;
        this.needsOffer = false;
    }

    /*
     *   EXTERNAL INTERFACE
     */
    async handleMsg(message) {
        //console.log(`CamConn[${this.name}]: Received message: ${JSON.stringify(message)}`);
        let msg = message.msg;
        let msgType = msg.msgType;
        switch (msgType) {
            case "offer": {
                await this.offerRcvd(message);
                break;
            }
            case "answer": {
                await this.answerRcvd(message);
                break;
            }
            case "icecandidate": {
                await this.iceCandidateRcvd(message);
                break;
            }
            default: {
                console.log(`CamConn rcvd msg of type: ${msgType}`);
            }
        }
    }

    streamIsReady(mediaStream) {
        console.log(`CamConn[${this.name}]: streamIsReady`);
        this.mediaStream = mediaStream;
        this.initPeerConnection(mediaStream);
    }

    createAndSendOffer() {
        if ((this.mediaStream != null) &&
            (this.peerConn != null) &&
            (!this.connecting) &&
            (!this.connected))
        {
            this.connecting = true;
            this.createOffer();
        }
    }

    initPeerConnection = (mediaStream) => {
        console.log(`CamConn[${this.name}]: initPeerConnection`);
        const rtcPeerConnCfg = {
            'iceServers': [{
                'urls': 'stun:stun.l.google.com:19302'
            }]
         };

        this.peerConn = new RTCPeerConnection(rtcPeerConnCfg);
        this.peerConn.onicecandidate = this.onIceCandidate;
        this.peerConn.onconnectionstatechange = this.handleConnectionChange;
        this.peerConn.oniceconnectionstatechange = this.handleIceStateChange;
        this.peerConn.ontrack = this.onAddTrack;

        this.addTracks();
    }

    sendMessage = (message) => {
        message.source = 'camera';
        message.toPlayerPosn = this.peerPosn;
        this.sendSocketMessage(message);
    }

    onAddTrack = (event) => {
        console.log(`CamConn[${this.name}]: onAddTrack called`);
        this.handleAddStream(this.peerPosn, event.streams[0]);
    }

    close = () => {
        if (this.peerConn != null) {
            this.peerConn.close();
        }
        this.peerConn = null;
        this.connected = false;
        this.connecting = false;
    }

    sendClose = () => {
        console.log(`CamConn[${this.name}] sendClose`);
        try {
            let message = new SocketMsg(this.sessionId);
            message.msgId = 'camConnClosed';
            this.sendMessage(message);
        } catch (error) {
            console.log(`Cam[${this.name}] cant send close: ${error.message}`);
        }
    }

    createOffer = async () => {
        console.log(`CamConn[${this.name}]: createOffer`);
        try {
            let offerDescription = await this.peerConn.createOffer();
            this.createdOffer(offerDescription);
        } catch (error) {
            console.log(`CamConn[${this.name}] cant create offer: ${error.message}`);
        }
    }

    createdOffer = async (offerDesc) => {
        console.log(`CamConn[${this.name}]: createdOffer`);
        try {
            await this.peerConn.setLocalDescription(offerDesc);
            console.log(`CamConn[${this.name}] set local description success`);
            await this.sendOffer(offerDesc);
        } catch (error) {
            console.log(`Cam[${this.name}] cant set local description: ${error.message}`);
        }
    }

    sendOffer = async (offerDesc) => {
        console.log(`CamConn[${this.name}] sendOffer`);
        try {
            let message = new SocketMsg(this.sessionId);
            message.msg = {
                msgType: 'offer',
                offer: offerDesc,
            };
            this.sendMessage(message);
        } catch (error) {
            console.log(`Cam[${this.name}] cant send offer: ${error.message}`);
        }
    }

    offerRcvd = async (message) => {
        this.connecting = true;
        let offer = message.msg.offer;
        console.log(`CamConn: offer received from ${message.fromPlayerPosn}`);
        try {
            if (this.peerConn == null) {
                this.initPeerConnection(null);
            }
            await this.peerConn.setRemoteDescription(new RTCSessionDescription(offer));
            let answer = await this.peerConn.createAnswer();
            this.sendAnswer(answer);
        } catch (error) {
            console.log(`CamConn[${this.name}] cant set remote description: ${error.message}`);
        }
    }

    sendAnswer = (answer) => {
        console.log(`CamConn[${this.name}] sending answer`);
        let message = new SocketMsg(this.sessionId);
        message.msg = {
            msgType: 'answer',
            answer: answer,
        };
        this.sendMessage(message);
        this.peerConn.setLocalDescription(answer);
    }

    addTracks = () => {
        if (this.mediaStream != null) {
            console.log(`CamConn[${this.name}]: adding tracks`);
            for (const track of this.mediaStream.getTracks()) {
                this.peerConn.addTrack(track, this.mediaStream);
            }
        } else {
            console.log(`CamConn[${this.name}]: mediaStream is null, not adding stream`);
        }
    }

    answerRcvd = async (message) => {
        let answer = message.msg.answer;
        console.log(`CamConn: answer received from ${message.fromPlayerPosn}`);
        try {
            await this.peerConn.setRemoteDescription(new RTCSessionDescription(answer));
            console.log(`CamConn[${this.name}]: Successfully setRemoteDescription`);
            this.connected = true;
            this.connecting = false;
        } catch (error) {
            console.log(`CamConn[${this.name}] cant set remote description: ${error.message}`);
        }
    }

    onIceCandidate = async (event) => {
        console.log(`CamConn[${this.name}] onIceCandidate`);
        //const peerConnection = event.target;
        const iceCandidate = event.candidate;
        if (iceCandidate) {
            this.sendIceCandidate(iceCandidate);
        }
    }

    sendIceCandidate = async (iceCandidate) => {
        console.log(`CamConn[${this.name}] sending ice candidate`);
        let message = new SocketMsg(this.sessionId);
        message.msg = {
            msgType: 'icecandidate',
            candidate: iceCandidate,
        };
        this.sendMessage(message);
    }

    iceCandidateRcvd = async (message) => {
        let candidate = message.msg.candidate;
        console.log(`CamConn[${this.name}]: candidate received from ${message.fromPlayerPosn}`);
        try {
            await this.peerConn.addIceCandidate(candidate);
            console.log(`CamConn: added ice candidate success`);
        } catch (error) {
            console.log(`CamConn[${this.name}] cant set remote description: ${error.message}`);
        }
    }

    handleConnectionChange = (event) => {
        console.log(`CamConn[${this.name}] handleConnectionChange: connection state =  ${this.peerConn.connectionState}`);
        if (this.peerConn.connectionState.toLowerCase() === "connected") {
            this.connected = true;
            this.connecting = false;
            this.handleConnected(this.name);
        }
    }

    handleIceStateChange = (event) => {
        console.log(`CamConn[${this.name}] handleIceStateChange: state =  ${this.peerConn.iceConnectionState}`);
    }

}

export default CamConn;
