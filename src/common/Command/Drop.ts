
import Command = require('../Command');
import GameObject = require('../GameObject');
import MessageClient = require('../MessageClient');
import Message = require('../Message');
import Container = require('../Components/Container');
import Executor = require('./Executor');
import DropExecutor = require('./Executor/DropExecutor');

import Vector2D = require('../Vector2D');

import PlayerAware = require('../IOC/PlayerAware');

class Drop implements Command, PlayerAware {

    private target:GameObject;
    private player:GameObject;

    constructor(target:GameObject) {
        this.target = target;
    }

    public setPlayer(player:GameObject) {
        this.player = player;
    }

    public getTurnsRequired():number {
        return 1;
    }

    public getTarget():GameObject {
        return this.target;
    }

    public canExecute():boolean {
        return this.player.getContainerComponent().getInventory().has(this.target.getId());
    }

    public getFeedbackMessage() {
        return "You drop the "+this.target.getName()+".";
    }

    public getExecutor():Executor {
        return new DropExecutor(this);
    }

    public serialize():any {
        return {
            target: this.target
        }
    }

    public deserialize(data:any) {
        this.target = data.target;
    }
}

export = Drop;