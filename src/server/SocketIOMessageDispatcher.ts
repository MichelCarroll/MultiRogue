
import Message = require('../common/Message');
import MessageDispatcher = require('./MessageDispatcher');

class SocketIOMessageDispatcher implements MessageDispatcher {

    private socket;
    private onBroadcast:(message:Message)=>void;
    private onDisconnect:()=>void;

    constructor(socket, onBroadcast:(message:Message)=>void, onDisconnect:()=>void) {
        this.socket = socket;
        this.onBroadcast = onBroadcast;
        this.onDisconnect = onDisconnect;
    }

    public emit(message:Message) {
        this.socket.emit(message.getName(), message.getData());
    }

    public on(name:string, callback:(message:Message)=>void) {
        var self = this;
        this.socket.on('disconnect', function() {
           self.onDisconnect();
        });
        this.socket.on(name, function(data:any) {
           callback(new Message(name, data));
        });
    }

    public broadcast(message:Message) {
        this.onBroadcast(message);
    }
}

export = SocketIOMessageDispatcher;