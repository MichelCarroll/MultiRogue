
import Command = require('../Command');
import GameObject = require('../../../common/GameObject');
import GameObjectLayer = require('../GameObjectLayer');
import Level = require('../Level');
import MessageClient = require('../MessageClient');
import Message = require('../../../common/Message');
import Vector2D = require('../../../common/Vector2D');

import ServerAware = require('../IOC/ServerAware');
import PlayerAware = require('../IOC/PlayerAware');
import LevelAware = require('../IOC/LevelAware');
import GameObjectLayerAware = require('../IOC/GameObjectLayerAware');

class Move implements Command, ServerAware, GameObjectLayerAware, PlayerAware, LevelAware {

    private direction:Vector2D;
    private player:GameObject;
    private goLayer:GameObjectLayer;
    private level:Level;
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

    public setLevel(level:Level) {
        this.level = level;
    }

    public setPlayer(player:GameObject) {
        this.player = player;
    }

    public getTurnsRequired():number {
        return 1;
    }

    public canExecute():boolean {
        var coord = this.player.getPosition().addVector(this.direction);
        if(!this.goLayer.getWalkableGameObject(coord)) {
            return false;
        }
        if(!this.level.canMoveTo(coord)) {
            return false;
        }
        return true;
    }

    public execute() {
        var coord = this.player.getPosition().addVector(this.direction);
        this.level.move(this.player, coord);
        this.messageClient.send(new Message('being-moved', {
            'id': this.player.getId(),
            'x': coord.x,
            'y': coord.y
        }));
    }
}

export = Move;