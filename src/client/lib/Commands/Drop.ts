
import Command = require('../Command');
import UIAdapter = require('../UIAdapter');
import Player = require('../Player');
import Level = require('../Level');
import MessageClient = require('../MessageClient');
import Message = require('../../../common/Message');
import Vector2D = require('../../../common/Vector2D');

class Drop implements Command {

    private goId:number;
    private messageClient:MessageClient;
    private uiAdapter:UIAdapter;
    private level:Level;
    private player:Player;

    constructor(goId:number, messageClient, uiAdapter, player, level) {
        this.goId = goId;
        this.messageClient = messageClient;
        this.uiAdapter = uiAdapter;
        this.player = player;
        this.level = level;
    }

    public getTurnsRequired():number {
        return 1;
    }

    public canExecute():boolean {
        var go = this.player.getInventory()[this.goId];
        if(!go) {
            return false;
        }
        return true;
    }

    public execute() {
        var go = this.player.getInventory()[this.goId];
        this.level.dropByPlayer(go, this.player);
        this.uiAdapter.logOnUI("You drop the "+go.getName()+".");
        this.uiAdapter.removeItemFromUI(go.getId());
        this.messageClient.send(new Message('being-dropped', {
            'playerId': this.player.getId(),
            'objectId': go.getId()
        }));
    }
}

export = Drop;