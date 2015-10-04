
/// <reference path="../../../definitions/vendor/socket.io-client.d.ts"/>

var io:SocketIO = require('socket.io-client');

import Message = require('../../common/Message');
import MessageClient = require('../../common/MessageClient');
import Serializer = require('../../common/Serializer');

import Socket = require('./Socket');

declare class SocketIO {
    connect(url: string): Socket;
    disconnect():void;
}

class SocketIOMessageClient implements MessageClient {

    private serverAddress:string;
    private debug:boolean;
    private onConnect:()=>void;
    private socket:Socket;

    constructor(serverAddress:string, onConnect:()=>void, debug:boolean = false) {
        this.serverAddress = serverAddress;
        this.debug = debug;
        this.onConnect = onConnect;
    }

    public connect() {
        this.socket = io.connect(this.serverAddress);
        this.onConnect();
    }

    public disconnect() {
        this.socket.disconnect();
        this.socket = null;
    }

    public isConnected():boolean {
        return !!this.socket;
    }

    public on(name, callback:(message:Message) => void)
    {
        if(!this.socket) {
            return;
        }

        var self = this;
        this.socket.on(name, function(data:any) {
            if(data) {
                Object.getOwnPropertyNames(data).forEach(function(name) {
                    if(data[name].__className) {
                        data[name] = Serializer.deserialize(data[name]);
                    }
                });
            }
            var message = new Message(name, data);
            if(self.debug) {
                console.log('Received:');
                console.log(message);
            }
            callback(message);
        });
    }

    public send(message:Message)
    {
        if(!this.socket) {
            return;
        }

        if(this.debug) {
            console.log('Sending:');
            console.log(message);
        }
        var data = message.getData();
        if(data) {
            Object.getOwnPropertyNames(data).forEach(function(name) {
                if(data[name].getId) {
                    data[name] = {
                      '__reference': data[name].getId()
                    };
                }
            });
        }
        this.socket.emit(message.getName(), data);
    }

}

export = SocketIOMessageClient;