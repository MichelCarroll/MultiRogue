

import Message = require('../../common/Message');


interface MessageClient {

    on(name, callback:(message:Message) => void):void;
    send(message:Message):void;
    connect():void;
    disconnect():void;

}

export = MessageClient;