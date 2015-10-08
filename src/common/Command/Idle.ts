
import Command from '../Command';
import MessageClient = require('../MessageClient');
import Message = require('../Message');
import Executor from './Executor';
import IdleExecutor = require('./Executor/IdleExecutor');
import PlayerAware from '../IOC/PlayerAware';
import GameObject = require('../GameObject');

class Idle implements Command, PlayerAware {

    private player:GameObject;

    public getTurnsRequired():number {
        return Math.max(1, this.player.getPlayableComponent().getRemainingTurns());
    }

    public setPlayer(player:GameObject) {
        this.player = player;
    }

    public canExecute():boolean {
        return true;
    }

    public getFeedbackMessage() {
        return "You do nothing.";
    }

    public serialize():any {
        return {};
    }

    public deserialize(data:any) {

    }

    public getExecutor():Executor {
        return new IdleExecutor(this);
    }
}

export = Idle;