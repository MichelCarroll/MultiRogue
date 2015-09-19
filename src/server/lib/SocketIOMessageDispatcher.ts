
import Message = require('../../common/Message');
import MessageDispatcher = require('./MessageDispatcher');

class SocketIOMessageDispatcher implements MessageDispatcher {

    private socket;

    constructor(socket) {
        this.socket = socket;
    }

    public emit(message:Message) {
        this.socket.emit(message.getName(), message.getData());
    }

    public on(name:string, callback:(message:Message)=>void) {
        this.socket.on(name, function(data:any) {
           callback(new Message(name, data));
        });
    }

    public broadcast(message:Message) {
        this.socket.broadcast.emit(message.getName(), message.getData());
    }
}

export = SocketIOMessageDispatcher;