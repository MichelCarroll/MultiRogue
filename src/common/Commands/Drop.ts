
import Command = require('../Command');
import GameObject = require('../GameObject');
import MessageClient = require('../MessageClient');
import Message = require('../Message');
import Container = require('../Components/Container');
import Vector2D = require('../Vector2D');

import PlayerAware = require('../IOC/PlayerAware');

class Drop implements Command, PlayerAware {

    private goId:number;
    private player:GameObject;

    constructor(goId:number) {
        this.goId = goId;
    }

    public setPlayer(player:GameObject) {
        this.player = player;
    }

    public getTurnsRequired():number {
        return 1;
    }

    public canExecute():boolean {
        return this.player.getContainerComponent().getInventory().has(this.goId);
    }

    public getFeedbackMessage() {
        var go = this.player.getContainerComponent().getInventory().get(this.goId);
        return "You drop the "+go.getName()+".";
    }

    public dispatch(messageClient:MessageClient) {
        var go = this.player.getContainerComponent().getInventory().get(this.goId);
        messageClient.send(new Message('being-dropped', {
            'playerId': this.player.getId(),
            'objectId': go.getId()
        }));
    }
}

export = Drop;