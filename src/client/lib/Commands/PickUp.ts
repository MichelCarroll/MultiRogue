
import Command = require('../Command');
import UIAdapter = require('../UIAdapter');
import GameObject = require('../../../common/GameObject');
import Level = require('../Level');
import MessageClient = require('../MessageClient');
import Message = require('../../../common/Message');
import Vector2D = require('../../../common/Vector2D');

import ServerAware = require('../IOC/ServerAware');
import UIAware = require('../IOC/UIAware');
import PlayerAware = require('../IOC/PlayerAware');
import LevelAware = require('../IOC/LevelAware');

class PickUp implements Command, ServerAware, UIAware, LevelAware, PlayerAware {

    private messageClient:MessageClient;
    private uiAdapter:UIAdapter;
    private level:Level;
    private player:GameObject;

    public setMessageClient(messageClient:MessageClient) {
        this.messageClient = messageClient;
    }

    public setUIAdapter(uiAdapter:UIAdapter) {
        this.uiAdapter = uiAdapter;
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
        var go = this.level.getTopItem(this.player.getPosition());
        if(!go) {
            return false;
        }
        return true;
    }

    public execute() {
        var go = this.level.getTopItem(this.player.getPosition());
        this.level.pickUpByPlayer(go, this.player);
        this.uiAdapter.logOnUI("You pick up the "+go.getName()+".");
        this.uiAdapter.addItemToUI(go.getId(), go.getName());
        this.messageClient.send(new Message('being-picked-up', {
            'playerId': this.player.getId(),
            'objectId': go.getId()
        }));
    }
}

export = PickUp;