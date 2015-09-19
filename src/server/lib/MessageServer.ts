
import MessageDispatcher = require('./MessageDispatcher');

interface MessageServer {

    start(onConnection:(messageDispatcher:MessageDispatcher)=>void):void;

}

export = MessageServer;