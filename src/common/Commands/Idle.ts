
import Command = require('../Command');
import MessageClient = require('../MessageClient');
import Message = require('../Message');

class Idle implements Command {

    public getTurnsRequired():number {
        return 1;
    }

    public canExecute():boolean {
        return true;
    }

    public getFeedbackMessage() {
        return "You do nothing.";
    }

    public dispatch(messageClient:MessageClient) {
        messageClient.send(new Message('idle'));
    }
}

export = Idle;