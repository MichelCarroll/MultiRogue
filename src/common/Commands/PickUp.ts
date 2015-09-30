
import Command = require('../Command');
import GameObject = require('../GameObject');
import MessageClient = require('../MessageClient');
import Message = require('../Message');
import Vector2D = require('../Vector2D');
import GameObjectLayer = require('../GameObjectLayer');

import ServerAware = require('../IOC/ServerAware');
import PlayerAware = require('../IOC/PlayerAware');
import GameObjectLayerAware = require('../IOC/GameObjectLayerAware');

class PickUp implements Command, ServerAware, GameObjectLayerAware, PlayerAware {

    private messageClient:MessageClient;
    private player:GameObject;
    private goLayer:GameObjectLayer;

    public setMessageClient(messageClient:MessageClient) {
        this.messageClient = messageClient;
    }

    public setGameObjectLayer(goLayer:GameObjectLayer) {
        this.goLayer = goLayer;
    }

    public setPlayer(player:GameObject) {
        this.player = player;
    }

    public getTurnsRequired():number {
        return 1;
    }

    public canExecute():boolean {
        var go = this.goLayer.getTopPickupableGameObject(this.player.getPosition());
        if(!go) {
            return false;
        }
        return true;
    }

    public getFeedbackMessage() {
        var go = this.goLayer.getTopPickupableGameObject(this.player.getPosition());
        return "You pick up the "+go.getName()+".";
    }

    public execute() {
        var go = this.goLayer.getTopPickupableGameObject(this.player.getPosition());
        this.messageClient.send(new Message('being-picked-up', {
            'playerId': this.player.getId(),
            'objectId': go.getId()
        }));
    }
}

export = PickUp;