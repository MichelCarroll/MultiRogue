
import Command from '../Command';
import MessageClient = require('../MessageClient');
import Message = require('../Message');
import Vector2D = require('../Vector2D');
import Executor from './Executor';
import ShoutExecutor = require('./Executor/ShoutExecutor');

class Shout implements Command {

    private text:string;

    constructor(text:string) {
        this.text = text;
    }

    public getText():string {
        return this.text;
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

    public serialize():any {
        return {
            text: this.text
        }
    }

    public deserialize(data:any) {
        this.text = data.text;
    }

    public getExecutor():Executor {
        return new ShoutExecutor(this);
    }
}

export = Shout;