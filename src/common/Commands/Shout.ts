
import Command = require('../Command');
import MessageClient = require('../MessageClient');
import Message = require('../Message');
import Vector2D = require('../Vector2D');

class Shout implements Command {

    private text:string;

    constructor(text:string) {
        this.text = text;
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

    public dispatch(messageClient:MessageClient) {
        messageClient.send(new Message('shout', {
            'text': this.text
        }));
    }

    public serialize():any {
        return {
            text: this.text
        }
    }

    public deserialize(data:any) {
        this.text = data.text;
    }
}

export = Shout;