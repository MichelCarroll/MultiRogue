
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

import Message = require('../common/Message');
import Repository = require('../common/Repository');
import Referencer = require('../common/Referencer');

import MessageDispatcher = require('../common/MessageDispatcher');
import DirectMessageDispatcher = require('./DirectMessageDispatcher');
import SocketIOMessageDispatcher = require('./SocketIOMessageDispatcher');

class MessageServer {

    private connections:MessageDispatcher[] = [];
    private connectionCallback:(messageDispatcher:MessageDispatcher)=>void;
    private port:number;
    private repository:Repository;

    constructor(repository:Repository, port?:number) {
        this.port = port;
        this.repository = repository;
    }

    public start(connectionCallback:(messageDispatcher:MessageDispatcher)=>void) {
        this.connectionCallback = connectionCallback;
        if(this.port) {
            this.listenToSocketEvents();
        }
    }

    private listenToSocketEvents() {
        var self = this;
        io.on('connection', this.onConnect.bind(this, true));
        http.listen(this.port, function(){});
    }

    private onConnect(isSocket:boolean, onMessage:any):any {
        var indexToDelete = -1;
        var dispatcher:MessageDispatcher = null;
        var self = this;
        if(isSocket) {
            dispatcher = new SocketIOMessageDispatcher(onMessage,
                new Referencer(this.repository),
                function(message:Message) { self.onBroadcast(dispatcher, message) },
                function() { self.onDisconnect(indexToDelete) }
            );
        } else {
            dispatcher = new DirectMessageDispatcher(onMessage,
                function(message:Message) { self.onBroadcast(dispatcher, message) },
                function() { self.onDisconnect(indexToDelete) }
            );
        }
        indexToDelete = this.connections.push(dispatcher) - 1;
        this.connectionCallback(dispatcher);
        return dispatcher;
    }

    private onDisconnect(indexToDelete:number) {
        delete this.connections[indexToDelete];
    }

    public connect(onMessage:(message:Message)=>void):(message:Message)=>void {
        var dispatcher:DirectMessageDispatcher = this.onConnect(false, onMessage);
        return dispatcher.receiveMessage.bind(dispatcher);
    }

    private onBroadcast(source:any, message:Message) {
        this.connections.filter(function(dispatcher) {
            return source !== dispatcher;
        }).forEach(function(dispatcher) {
            dispatcher.emit(message);
        });
    }

}

export = MessageServer;