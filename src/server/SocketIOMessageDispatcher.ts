
import Message = require('../common/Message');
import MessageDispatcher = require('./MessageDispatcher');
import Serializer = require('../common/Serializer');


var util = require('util');

class SocketIOMessageDispatcher implements MessageDispatcher {

    private socket;
    private onBroadcast:(message:Message)=>void;
    private onDisconnect:()=>void;

    constructor(socket, onBroadcast:(message:Message)=>void, onDisconnect:()=>void) {
        this.socket = socket;
        this.onBroadcast = onBroadcast;
        this.onDisconnect = onDisconnect;
    }

    private serializeData(data):any {
        if(!data) {
            return {};
        }
        Object.getOwnPropertyNames(data).forEach(function(name) {
            if(typeof data[name] == 'object' && data[name].serialize) {
                data[name] = Serializer.serialize(data[name]);
            }
        });
        return data;
    }

    public emit(message:Message) {
        this.socket.emit(message.getName(), this.serializeData(message.getData()));
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