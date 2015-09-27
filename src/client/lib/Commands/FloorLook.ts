
import Command = require('../Command');
import UIAdapter = require('../UIAdapter');
import Being = require('../../../common/Being');
import Level = require('../Level');
import MessageClient = require('../MessageClient');
import Message = require('../../../common/Message');
import Vector2D = require('../../../common/Vector2D');

import ServerAware = require('../IOC/ServerAware');
import UIAware = require('../IOC/UIAware');
import PlayerAware = require('../IOC/PlayerAware');
import LevelAware = require('../IOC/LevelAware');

class FloorLook implements Command, ServerAware, UIAware, PlayerAware, LevelAware {

    private messageClient:MessageClient;
    private uiAdapter:UIAdapter;
    private level:Level;
    private player:Being;

    public setMessageClient(messageClient:MessageClient) {
        this.messageClient = messageClient;
    }

    public setUIAdapter(uiAdapter:UIAdapter) {
        this.uiAdapter = uiAdapter;
    }

    public setLevel(level:Level) {
        this.level = level;
    }

    public setPlayer(player:Being) {
        this.player = player;
    }

    public getTurnsRequired():number {
        return 1;
    }

    public canExecute():boolean {
        var go = this.level.getTopGroundObject(this.player.getPosition());
        if(!go) {
            return false;
        }
        return true;
    }

    public execute() {
        var go = this.level.getTopGroundObject(this.player.getPosition());
        this.uiAdapter.logOnUI("You see "+go.getDescription()+".");
        this.messageClient.send(new Message('being-looked-at-floor', {
            'id': this.player.getId()
        }));
    }
}

export = FloorLook;