
import Command = require('../Command');
import GameObject = require('../GameObject');
import GameObjectLayer = require('../GameObjectLayer');
import MessageClient = require('../MessageClient');
import Message = require('../Message');
import Executor = require('./Executor');
import MoveExecutor = require('./Executor/MoveExecutor');
import Vector2D = require('../Vector2D');

import PlayerAware = require('../IOC/PlayerAware');
import GameObjectLayerAware = require('../IOC/GameObjectLayerAware');

class Move implements Command, GameObjectLayerAware, PlayerAware {

    private direction:Vector2D;
    private player:GameObject;
    private goLayer:GameObjectLayer;

    constructor(direction:Vector2D) {
        this.direction = direction;
    }

    public setGameObjectLayer(goLayer:GameObjectLayer) {
        this.goLayer = goLayer;
    }

    public setPlayer(player:GameObject) {
        this.player = player;
    }

    public getDirection():Vector2D {
        return this.direction;
    }

    public getTurnsRequired():number {
        return 1;
    }

    public getFeedbackMessage() {
        return '';
    }

    public canExecute():boolean {
        var coord = this.player.getPosition().addVector(this.direction);
        if(coord.distanceFrom(this.player.getPosition()) >= 2) { //diag is ok, and it's 1.4
            return false;
        }
        else if(!this.goLayer.getWalkableGameObject(coord)) {
            return false;
        }
        else if(this.goLayer.blocked(coord)) {
            return false;
        }
        return true;
    }

    public serialize():any {
        return {
            direction: this.direction
        }
    }

    public deserialize(data:any) {
        this.direction = data.direction;
    }

    public getExecutor():Executor {
        return new MoveExecutor(this);
    }
}

export = Move;