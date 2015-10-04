
import Command = require('../Command');
import GameObject = require('../GameObject');
import MessageClient = require('../MessageClient');
import Message = require('../Message');
import Vector2D = require('../Vector2D');
import GameObjectLayer = require('../GameObjectLayer');
import Executor = require('./Executor');
import PickUpExecutor = require('./Executor/PickUpExecutor');

import PlayerAware = require('../IOC/PlayerAware');
import GameObjectLayerAware = require('../IOC/GameObjectLayerAware');

class PickUp implements Command, GameObjectLayerAware, PlayerAware {

    private player:GameObject;
    private goLayer:GameObjectLayer;

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
            throw new Error('There\'s nothing to pick up');
        }
        else if(!go.isContent()) {
            throw new Error('This GO can\'t be picked up');
        }
        return true;
    }

    public getFeedbackMessage() {
        var go = this.goLayer.getTopPickupableGameObject(this.player.getPosition());
        return "You pick up the "+go.getName()+".";
    }

    public serialize():any {
        return {};
    }

    public deserialize(data:any) {

    }

    public getExecutor():Executor {
        return new PickUpExecutor(this);
    }
}

export = PickUp;