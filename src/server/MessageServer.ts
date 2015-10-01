
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

import Message = require('../common/Message');

import MessageDispatcher = require('./MessageDispatcher');
import DirectMessageDispatcher = require('./DirectMessageDispatcher');
import SocketIOMessageDispatcher = require('./SocketIOMessageDispatcher');

class MessageServer {

    private directConnections:DirectMessageDispatcher[] = [];
    private socketIoConnections:SocketIOMessageDispatcher[] = [];
    private onConnection:(messageDispatcher:MessageDispatcher)=>void;
    private port:number;

    constructor(port?:number) {
        this.port = port;
    }

    public start(onConnection:(messageDispatcher:MessageDispatcher)=>void) {
        this.onConnection = onConnection;
        if(this.port) {
            this.listenToSocketEvents();
        }
    }

    private listenToSocketEvents() {
        var self = this;
        io.on('connection', function (socket) {
            var indexToDelete = -1;
            var dispatcher = new SocketIOMessageDispatcher(socket, function(message:Message) {
                self.onBroadcast(false, message, dispatcher);
            }, function() {
                delete self.socketIoConnections[indexToDelete];
            });
            indexToDelete = self.socketIoConnections.push(dispatcher) - 1;
            self.onConnection(dispatcher);
        });
        http.listen(this.port, function(){});
    }

    public connect(onMessage:(message:Message)=>void):(message:Message)=>void {
        var self = this;
        var indexToDelete = -1;
        var dispatcher = new DirectMessageDispatcher(onMessage, function(message:Message) {
            self.onBroadcast(true, message, dispatcher);
        }, function() {
            delete self.directConnections[indexToDelete];
        });
        indexToDelete = this.directConnections.push(dispatcher) - 1;
        this.onConnection(dispatcher);
        return dispatcher.receiveMessage.bind(dispatcher);
    }

    private onBroadcast(fromDirect:boolean, message:Message, source:any) {
        if(fromDirect) {
            this.directConnections.filter(function(dispatcher) {
                return source !== dispatcher;
            }).forEach(function(dispatcher) {
                dispatcher.emit(message);
            });
            this.socketIoConnections.forEach(function(dispatcher) {
                dispatcher.emit(message);
            });
        }
        else {
            this.socketIoConnections.filter(function(dispatcher) {
                return source !== dispatcher;
            }).forEach(function(dispatcher) {
                dispatcher.emit(message);
            });
            this.directConnections.forEach(function(dispatcher) {
                dispatcher.emit(message);
            });
        }
    }

}

export = MessageServer;