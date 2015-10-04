
import Message = require('./Message');

interface MessageDispatcher {
    emit(message:Message):void;
    on(name:string, callback:(message:Message)=>void):void;
    broadcast(message:Message):void;
}

export = MessageDispatcher;