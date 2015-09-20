
import DirectMessageServer = require('../../server/DirectMessageServer');

class ClientParameters {

    private serverAddress:string;
    private messagingServer:DirectMessageServer;

    constructor(serverAddress:string, messagingServer?:DirectMessageServer) {
        this.serverAddress = serverAddress;
        this.messagingServer = messagingServer;
    }

    public getServerAddress():string {
        return this.serverAddress;
    }

    public getMessagingServer():DirectMessageServer {
        return this.messagingServer;
    }
}


export = ClientParameters;