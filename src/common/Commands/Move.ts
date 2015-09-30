
import Command = require('../Command');
import GameObject = require('../GameObject');
import GameObjectLayer = require('../GameObjectLayer');
import MessageClient = require('../MessageClient');
import Message = require('../Message');
import Vector2D = require('../Vector2D');

import ServerAware = require('../IOC/ServerAware');
import PlayerAware = require('../IOC/PlayerAware');
import GameObjectLayerAware = require('../IOC/GameObjectLayerAware');

class Move implements Command, ServerAware, GameObjectLayerAware, PlayerAware {

    private direction:Vector2D;
    private player:GameObject;
    private goLayer:GameObjectLayer;
    private messageClient:MessageClient;

    constructor(direction:Vector2D) {
        this.direction = direction;
    }

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

    public getFeedbackMessage() {
        return '';
    }

    public canExecute():boolean {
        var coord = this.player.getPosition().addVector(this.direction);
        if(!this.goLayer.getWalkableGameObject(coord)) {
            return false;
        }
        else if(this.goLayer.blocked(coord.toString())) {
            return false;
        }
        return true;
    }

    public execute() {
        var coord = this.player.getPosition().addVector(this.direction);
        this.messageClient.send(new Message('being-moved', {
            'id': this.player.getId(),
            'x': coord.x,
            'y': coord.y
        }));
    }
}

export = Move;