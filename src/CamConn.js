class CamConn {
    constructor(params) {
        this.name = params.name;
        this.playerPosn = params.playerPosn;
        this.peerPosn = params.peerPosn;
        this.gameData = params.gameData;
        this.peerConn = null;
        this.sendSocketMessage = params.sendMessage;
        this.handleAddStream = params.handleAddStream;
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

    async streamIsReady(mediaStream) {
        console.log(`CamConn[${this.name}]: streamIsReady`);
        this.initPeerConnection(mediaStream);
        if (this.gameData[this.peerPosn].enteredGame) {
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
        //this.peerConn.addEventListener('addstream', this.onAddStream);
        this.peerConn.ontrack = this.onAddTrack;
        if (mediaStream != null) {
            console.log(`CamConn[${this.name}]: mediaStream is not null, adding stream`);
            for (const track of mediaStream.getTracks()) {
                this.peerConn.addTrack(track, mediaStream);
            }
        } else {
            console.log(`CamConn[${this.name}]: mediaStream is null, not adding stream`);
        }
    }

    sendMessage = (msg) => {
        let message = {
            source: "camera",
            toPlayerPosn: this.peerPosn,
            msg: msg,
        };
        this.sendSocketMessage(message);
    }

    //onAddStream = (event) => {
    //    console.log(`CamConn[${this.name}]: onAddStream called`);
    //    this.handleAddStream(this.peerPosn, event.stream);
    //}

    onAddTrack = (event) => {
        console.log(`CamConn[${this.name}]: onAddTrack called`);
        this.handleAddStream(this.peerPosn, event.streams[0]);
    }

    createOffer = async () => {
        console.log(`CamConn[${this.name}]: createOffer`);
        //const offerOptions = {
        //    offerToReceiveVideo: 1,
        //};

        try {
            //let offerDescription = await this.peerConn.createOffer(offerOptions);
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
            this.sendMessage({msgType: "offer", offer: offerDesc});
        } catch (error) {
            console.log(`Cam[${this.name}] cant send offer: ${error.message}`);
        }
    }

    offerRcvd = async (message) => {
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
        this.sendMessage({msgType: "answer", answer: answer});
        this.peerConn.setLocalDescription(answer);
    }

    answerRcvd = async (message) => {
        let answer = message.msg.answer;
        console.log(`CamConn: answer received from ${message.fromPlayerPosn}`);
        try {
            await this.peerConn.setRemoteDescription(new RTCSessionDescription(answer));
            console.log(`CamConn[${this.name}]: Successfully setRemoteDescription`)
        } catch (error) {
            console.log(`CamConn[${this.name}] cant set remote description: ${error.message}`);
        }
    }

    onIceCandidate = async (event) => {
        console.log(`CamConn[${this.name}] onIceCandidate`);
        //const peerConnection = event.target;
        const iceCandidate = event.candidate;
        if (iceCandidate) {
//            const newIceCandidate = new RTCIceCandidate(iceCandidate);
            this.sendIceCandidate(iceCandidate);
        }
    }

    sendIceCandidate = async (iceCandidate) => {
        console.log(`CamConn[${this.name}] sending ice candidate`);
        this.sendMessage({msgType: "icecandidate", candidate: iceCandidate});
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
    }

    handleIceStateChange = (event) => {
        console.log(`CamConn[${this.name}] handleIceStateChange: state =  ${this.peerConn.iceConnectionState}`);
    }

}

export default CamConn;
