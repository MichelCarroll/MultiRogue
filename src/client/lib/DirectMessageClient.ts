

import Message = require('../../common/Message');
import MessageClient = require('./MessageClient');
import DirectMessageServer = require('../../server/DirectMessageServer');

class DirectMessageClient implements MessageClient {

    private server:DirectMessageServer;
    private listeners:any;
    private dispatchCallback:(message:Message)=>void;

    constructor(server:DirectMessageServer) {
        this.server = server;
    }

    public connect() {
        this.dispatchCallback = this.server.connect(this.receiveMessage);
    }

    private receiveMessage(message:Message) {
        if(this.listeners[name]) {
            this.listeners[name](message);
        }
    }

    public on(name, callback:(message:Message) => void)
    {
        this.listeners[name] = callback;
    }

    public send(message:Message)
    {
        this.dispatchCallback(message);
    }

}

export = DirectMessageClient;