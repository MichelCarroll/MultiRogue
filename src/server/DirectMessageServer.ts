

import Message = require('../common/Message');
import MessageServer = require('./MessageServer');
import MessageDispatcher = require('./MessageDispatcher');
import DirectMessageDispatcher = require('./DirectMessageDispatcher');

class DirectMessageServer implements MessageServer {

    private connections:DirectMessageDispatcher[];
    private onConnection:(messageDispatcher:MessageDispatcher)=>void;

    constructor() {
        this.connections = [];
    }

    public start(onConnection:(messageDispatcher:MessageDispatcher)=>void) {
        this.onConnection = onConnection;
    }

    public onBroadcast(message:Message, source:DirectMessageDispatcher) {
        this.connections.filter(function(dispatcher) {
            return source !== dispatcher;
        }).forEach(function(dispatcher) {
            dispatcher.emit(message);
        });
    }

    public connect(onMessage:(message:Message)=>void):(message:Message)=>void {
        var self = this;
        var dispatcher = new DirectMessageDispatcher(onMessage, function(message:Message) {
            self.onBroadcast(message, dispatcher);
        });
        this.connections.push(dispatcher);
        this.onConnection(dispatcher);
        return dispatcher.receiveMessage.bind(dispatcher);
    }

}

export = DirectMessageServer;