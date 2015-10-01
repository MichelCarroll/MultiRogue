

import Message = require('../../common/Message');
import MessageClient = require('../../common/MessageClient');
import DirectMessageServer = require('../../server/MessageServer');

class DirectMessageClient implements MessageClient {

    private server:DirectMessageServer;
    private listeners:any;
    private onConnect:()=>void;
    private dispatchCallback:(message:Message)=>void;

    constructor(server:DirectMessageServer, onConnect:()=>void) {
        this.server = server;
        this.onConnect = onConnect;
        this.listeners = {};
    }

    public connect() {
        this.dispatchCallback = this.server.connect(this.receiveMessage.bind(this));
        this.onConnect();
    }

    public disconnect() {
        this.dispatchCallback(new Message('disconnect')); //essentially what socketio does
        this.dispatchCallback = null;
        this.listeners = {};
    }

    public isConnected():boolean {
        return !!this.dispatchCallback;
    }

    private receiveMessage(message:Message) {
        if(this.listeners[message.getName()]) {
            this.listeners[message.getName()](message);
        }
    }

    public on(name, callback:(message:Message) => void) {
        this.listeners[name] = callback;
    }

    public send(message:Message) {
        this.dispatchCallback(message);
    }

}

export = DirectMessageClient;