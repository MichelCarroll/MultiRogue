
import Command = require('../Command');
import UIAdapter = require('../UIAdapter');
import Player = require('../Player');
import Level = require('../Level');
import MessageClient = require('../MessageClient');
import Message = require('../../../common/Message');
import Vector2D = require('../../../common/Vector2D');

class FloorLook implements Command {

    private messageClient:MessageClient;
    private uiAdapter:UIAdapter;
    private level:Level;
    private player:Player;

    constructor(messageClient, uiAdapter, player, level) {
        this.messageClient = messageClient;
        this.uiAdapter = uiAdapter;
        this.player = player;
        this.level = level;
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