
interface Command {

    getTurnsRequired():number;
    canExecute():boolean;
    execute():void;

}

export = Command;