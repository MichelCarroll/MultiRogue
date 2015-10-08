
import MessageClient  from './MessageClient';
import Serializable from './Serializable';
import Executor from './Command/Executor';

interface Command extends Serializable {

    getTurnsRequired():number;
    canExecute():boolean;
    getFeedbackMessage():string;
    getExecutor():Executor;

}

export default Command;