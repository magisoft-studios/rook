import CamConn from "./CamConn";

class SocketMsg {
    constructor(sessionId) {
        this.sessionId = sessionId;
        this.msgId = "";
        this.status = "";
        this.errorMsg = "";
        this.msg = null;
    }
}

export default SocketMsg;
