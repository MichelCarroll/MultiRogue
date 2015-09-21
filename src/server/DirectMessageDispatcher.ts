
import Message = require('../common/Message');
import MessageDispatcher = require('./MessageDispatcher');

class DirectMessageDispatcher implements MessageDispatcher {

    private callback:(message:Message)=>void;
    private onBroadcast:(message:Message)=>void;
    private listeners:any;

    constructor(callback:(message:Message)=>void, onBroadcast:(message:Message)=>void) {
        this.listeners = {};
        this.callback = callback;
        this.onBroadcast = onBroadcast;
    }

    public emit(message:Message) {
        this.callback(message);
    }

    public receiveMessage(message:Message) {
        if(this.listeners[message.getName()]) {
            this.listeners[message.getName()](message);
        }
    }

    public on(name:string, callback:(message:Message)=>void) {
        this.listeners[name] = callback;
    }

    public broadcast(message:Message) {
        this.onBroadcast(message);
    }
}

export = DirectMessageDispatcher;