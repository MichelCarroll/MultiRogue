
import Command = require('../Command');
import UIAdapter = require('../UIAdapter');
import MessageClient = require('../MessageClient');
import Message = require('../../../common/Message');
import Vector2D = require('../../../common/Vector2D');

class Shout implements Command {

    private text:string;
    private messageClient:MessageClient;
    private uiAdapter:UIAdapter;

    constructor(text:string, messageClient, uiAdapter) {
        this.text = text;
        this.messageClient = messageClient;
        this.uiAdapter = uiAdapter;
    }

    public getTurnsRequired():number {
        return 1;
    }

    public canExecute():boolean {
        return true;
    }

    public execute() {
        this.uiAdapter.logOnUI("You shout \""+this.text+"\"!!");
        this.messageClient.send(new Message('shout', {
            'text': this.text
        }));
    }
}

export = Shout;