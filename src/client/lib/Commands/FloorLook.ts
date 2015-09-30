
import Command = require('../Command');
import UIAdapter = require('../UIAdapter');
import GameObject = require('../../../common/GameObject');
import MessageClient = require('../MessageClient');
import Message = require('../../../common/Message');
import Vector2D = require('../../../common/Vector2D');
import GameObjectLayer = require('../../../common/GameObjectLayer');

import ServerAware = require('../IOC/ServerAware');
import UIAware = require('../IOC/UIAware');
import PlayerAware = require('../IOC/PlayerAware');
import GameObjectLayerAware = require('../IOC/GameObjectLayerAware');

class FloorLook implements Command, ServerAware, UIAware, GameObjectLayerAware, PlayerAware {

    private messageClient:MessageClient;
    private uiAdapter:UIAdapter;
    private player:GameObject;
    private goLayer:GameObjectLayer;

    public setMessageClient(messageClient:MessageClient) {
        this.messageClient = messageClient;
    }

    public setGameObjectLayer(goLayer:GameObjectLayer) {
        this.goLayer = goLayer;
    }

    public setUIAdapter(uiAdapter:UIAdapter) {
        this.uiAdapter = uiAdapter;
    }

    public setPlayer(player:GameObject) {
        this.player = player;
    }

    public getTurnsRequired():number {
        return 1;
    }

    public canExecute():boolean {
        var go = this.goLayer.getNonCollidableGameObject(this.player.getPosition());
        if(!go) {
            return false;
        }
        return true;
    }

    public execute() {
        var go = this.goLayer.getNonCollidableGameObject(this.player.getPosition());
        this.uiAdapter.logOnUI("You see "+go.getDescription()+".");
        this.messageClient.send(new Message('being-looked-at-floor', {
            'id': this.player.getId()
        }));
    }
}

export = FloorLook;