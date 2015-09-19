
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

import MessageServer = require('./MessageServer');
import MessageDispatcher = require('./MessageDispatcher');
import SocketIOMessageDispatcher = require('./SocketIOMessageDispatcher');

class SocketIOMessageServer implements MessageServer {

    private onConnection:(messageDispatcher:MessageDispatcher)=>void;
    private port:number;

    constructor(port:number) {
        this.port = port;
    }

    public start(onConnection:(messageDispatcher:MessageDispatcher)=>void) {
        this.onConnection = onConnection;
        this.listenToSocketEvents();
        http.listen(this.port, function(){});
    }

    private listenToSocketEvents() {
        var self = this;
        io.on('connection', function (socket) {
            self.onConnection(new SocketIOMessageDispatcher(socket));
        });
    }

}

export = SocketIOMessageServer;