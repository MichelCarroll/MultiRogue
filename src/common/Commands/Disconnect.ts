
import Command = require('../Command');
import MessageClient = require('../MessageClient');
import Message = require('../Message');

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

    public getFeedbackMessage() {
        return '';
    }

    public dispatch(messageClient:MessageClient) {
        messageClient.disconnect();
    }
}

export = Disconnect;