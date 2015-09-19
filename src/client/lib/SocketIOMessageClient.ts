
/// <reference path="../../../definitions/vendor/socket.io-client.d.ts"/>

var io:SocketIO = require('socket.io-client');
import Socket = require('./Socket');
import Message = require('../../common/Message');
import MessageClient = require('./MessageClient');

declare class SocketIO {
    connect(url: string): Socket;
}

class SocketIOMessageClient implements MessageClient {

    private socket:Socket;

    constructor()
    {
        var url = '';
        if(document.location.protocol === 'file:') {
            url = 'http://localhost';
        } else {
            url = 'http://'+document.location.hostname;
        }

        this.socket = io.connect(url+':3000');
    }

    public on(name, callback:(message:Message) => void)
    {
        this.socket.on(name, function(data:any) {
            callback(new Message(name, data));
        });
    }

    public send(message:Message)
    {
        this.socket.emit(message.getName(), message.getData());
    }

}

export = SocketIOMessageClient;