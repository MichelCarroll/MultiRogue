

import Message = require('../../common/Message');
import MessageClient = require('./MessageClient');
import DirectMessageServer = require('../../server/DirectMessageServer');

class DirectMessageClient implements MessageClient {

    private server:DirectMessageServer;
    private listeners:any;
    private dispatchCallback:(message:Message)=>void;

    constructor(server:DirectMessageServer) {
        this.server = server;
        this.listeners = {};
    }

    public connect() {
        this.dispatchCallback = this.server.connect(this.receiveMessage.bind(this));
    }

    public disconnect() {
        this.dispatchCallback(new Message('disconnect')); //essentially what socketio does
        this.dispatchCallback = null;
        this.listeners = {};
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