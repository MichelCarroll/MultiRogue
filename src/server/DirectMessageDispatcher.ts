
import Message = require('../common/Message');
import MessageDispatcher from '../common/MessageDispatcher';

class DirectMessageDispatcher implements MessageDispatcher {

    private callback:(message:Message)=>void;
    private onBroadcast:(message:Message)=>void;
    private onDisconnect:()=>void;
    private listeners:any;

    constructor(callback:(message:Message)=>void, onBroadcast:(message:Message)=>void, onDisconnect:()=>void) {
        this.listeners = {};
        this.callback = callback;
        this.onBroadcast = onBroadcast;
        this.onDisconnect = onDisconnect;
    }

    public emit(message:Message) {
        this.callback(message);
    }

    public receiveMessage(message:Message) {
        if(message.getName() == 'disconnect') {
            this.onDisconnect();
        }
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