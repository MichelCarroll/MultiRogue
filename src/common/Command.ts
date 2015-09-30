
interface Command {

    getTurnsRequired():number;
    canExecute():boolean;
    execute():void;
    getFeedbackMessage():string;

}

export = Command;