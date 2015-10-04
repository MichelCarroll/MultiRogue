
import Command = require('../Command');
import GameObject = require('../GameObject');
import MessageClient = require('../MessageClient');
import Message = require('../Message');
import Container = require('../Components/Container');
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

    public canExecute():boolean {
        return this.player.getContainerComponent().getInventory().has(this.target.getId());
    }

    public getFeedbackMessage() {
        return "You drop the "+this.target.getName()+".";
    }

    public dispatch(messageClient:MessageClient) {
        messageClient.send(new Message('being-dropped', {
            'target': this.target
        }));
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