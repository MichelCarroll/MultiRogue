
import Command = require('../Command');
import MessageClient = require('../MessageClient');
import Message = require('../Message');
import Vector2D = require('../Vector2D');

import ServerAware = require('../IOC/ServerAware');

class Shout implements Command, ServerAware{

    private text:string;
    private messageClient:MessageClient;

    constructor(text:string) {
        this.text = text;
    }

    public setMessageClient(messageClient:MessageClient) {
        this.messageClient = messageClient;
    }

    public getTurnsRequired():number {
        return 0;
    }

    public canExecute():boolean {
        return true;
    }

    public getFeedbackMessage() {
        return "You shout \""+this.text+"\"!!";
    }

    public execute() {
        this.messageClient.send(new Message('shout', {
            'text': this.text
        }));
    }
}

export = Shout;