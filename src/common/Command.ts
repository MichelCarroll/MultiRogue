
import MessageClient = require('./MessageClient');

interface Command {

    getTurnsRequired():number;
    canExecute():boolean;
    dispatch(messageClient:MessageClient);
    getFeedbackMessage():string;

}

export = Command;