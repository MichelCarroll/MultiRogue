
import MessageClient = require('./MessageClient');

interface Command {

    getTurnsRequired():number;
    canExecute():boolean;
    execute(messageClient:MessageClient);
    getFeedbackMessage():string;

}

export = Command;