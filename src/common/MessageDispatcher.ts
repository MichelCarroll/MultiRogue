
import Message = require('./Message');

interface MessageDispatcher {
    emit(message:Message):void;
    on(name:string, callback:(message:Message)=>void):void;
    broadcast(message:Message):void;
}

declare var MessageDispatcher; //make IDE stop complaining

export = MessageDispatcher;