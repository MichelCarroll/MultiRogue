
import Message = require('../common/Message');
import MessageDispatcher = require('../common/MessageDispatcher');
import Serializer = require('../common/Serializer');
import Referencer = require('../common/Referencer');


var util = require('util');

class SocketIOMessageDispatcher implements MessageDispatcher {

    private socket;
    private onBroadcast:(message:Message)=>void;
    private onDisconnect:()=>void;
    private referencer:Referencer;

    constructor(socket, referencer:Referencer, onBroadcast:(message:Message)=>void, onDisconnect:()=>void) {
        this.socket = socket;
        this.referencer = referencer;
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
            Object.getOwnPropertyNames(data).forEach(function(name) {
                if(data[name].__reference) {
                    data[name] = self.referencer.dereference(data[name].__reference);
                }
                else if(data[name].__className) {
                    data[name] = Serializer.deserialize(data[name]);
                }
            });
            callback(new Message(name, data));
        });
    }

    public broadcast(message:Message) {
        this.onBroadcast(message);
    }
}

export = SocketIOMessageDispatcher;