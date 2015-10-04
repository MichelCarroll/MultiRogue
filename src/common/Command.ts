
import MessageClient = require('./MessageClient');
import Serializable = require('./Serializable');

interface Command extends Serializable {

    getTurnsRequired():number;
    canExecute():boolean;
    dispatch(messageClient:MessageClient);
    getFeedbackMessage():string;

}

export = Command;