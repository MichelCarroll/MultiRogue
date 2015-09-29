
import Command = require('../Command');
import MessageClient = require('../MessageClient');
import Message = require('../../../common/Message');

import ServerAware = require('../IOC/ServerAware');

class Disconnect implements Command, ServerAware {

    private messageClient:MessageClient;

    public setMessageClient(messageClient:MessageClient) {
        this.messageClient = messageClient;
    }

    public getTurnsRequired():number {
        return 0;
    }

    public canExecute():boolean {
        return this.messageClient.isConnected();
    }

    public execute() {
        this.messageClient.disconnect();
    }
}

export = Disconnect;