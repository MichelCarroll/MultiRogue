
/// <reference path="../../../definitions/vendor/socket.io-client.d.ts"/>

var io:SocketIO = require('socket.io-client');
import Socket = require('./Socket');
import Message = require('../../common/Message');
import MessageClient = require('./MessageClient');

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
        this.socket.emit(message.getName(), message.getData());
    }

}

export = SocketIOMessageClient;