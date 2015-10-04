
import MessageClient = require('./MessageClient');
import Serializable = require('./Serializable');
import Executor = require('./Command/Executor');

interface Command extends Serializable {

    getTurnsRequired():number;
    canExecute():boolean;
    getFeedbackMessage():string;
    getExecutor():Executor;

}

export = Command;