

import Socket = require('./Socket');
import Message = require('./Message');

class MessageRelayer {

    private socket:Socket;

    constructor(socket:Socket)
    {
        this.socket = socket;
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

export = MessageRelayer;