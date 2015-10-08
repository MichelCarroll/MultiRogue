

import Message = require('Message');


interface MessageClient {

    on(name, callback:(message:Message) => void):void;
    send(message:Message):void;
    connect():void;
    disconnect():void;
    isConnected():boolean;

}

export default MessageClient;