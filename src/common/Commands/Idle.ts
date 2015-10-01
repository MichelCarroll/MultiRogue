
import Command = require('../Command');
import MessageClient = require('../MessageClient');
import Message = require('../Message');

import ServerAware = require('../IOC/ServerAware');

class Idle implements Command, ServerAware{

    private text:string;
    private messageClient:MessageClient;

    constructor(text:string) {
        this.text = text;
    }

    public setMessageClient(messageClient:MessageClient) {
        this.messageClient = messageClient;
    }

    public getTurnsRequired():number {
        return 1;
    }

    public canExecute():boolean {
        return true;
    }

    public getFeedbackMessage() {
        return "You do nothing.";
    }

    public execute() {
        this.messageClient.send(new Message('idle'));
    }
}

export = Idle;