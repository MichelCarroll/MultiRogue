
import Command = require('../Command');
import UIAdapter = require('../UIAdapter');
import Player = require('../Player');
import Level = require('../Level');
import MessageClient = require('../MessageClient');
import Message = require('../../../common/Message');
import Vector2D = require('../../../common/Vector2D');

class PickUp implements Command {

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