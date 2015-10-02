
import Command = require('../Command');
import MessageClient = require('../MessageClient');
import Message = require('../Message');

import ServerAware = require('../IOC/ServerAware');

class Connect implements Command, ServerAware {

    public static AI = 'ai';
    public static PLAYER = 'player';

    private messageClient:MessageClient;
    private type:string;

    constructor(type:string) {
        this.type = type;
    }

    public setMessageClient(messageClient:MessageClient) {
        this.messageClient = messageClient;
    }

    public getTurnsRequired():number {
        return 0;
    }

    public canExecute():boolean {
        return !this.messageClient.isConnected();
    }

    public getFeedbackMessage() {
        return '';
    }

    public execute() {
        this.messageClient.connect();
        this.messageClient.send(new Message('ready', {
            'type': this.type
        }));
    }
}

export = Connect;