
import Command = require('../Command');
import UIAdapter = require('../UIAdapter');
import Player = require('../Player');
import Level = require('../Level');
import MessageClient = require('../MessageClient');
import Message = require('../../../common/Message');
import Vector2D = require('../../../common/Vector2D');

import ServerAware = require('../IOC/ServerAware');
import UIAware = require('../IOC/UIAware');
import PlayerAware = require('../IOC/PlayerAware');
import LevelAware = require('../IOC/LevelAware');

class Drop implements Command, ServerAware, UIAware, PlayerAware, LevelAware {

    private goId:number;
    private messageClient:MessageClient;
    private uiAdapter:UIAdapter;
    private level:Level;
    private player:Player;

    constructor(goId:number) {
        this.goId = goId;
    }

    public setMessageClient(messageClient:MessageClient) {
        this.messageClient = messageClient;
    }

    public setUIAdapter(uiAdapter:UIAdapter) {
        this.uiAdapter = uiAdapter;
    }

    public setLevel(level:Level) {
        this.level = level;
    }

    public setPlayer(player:Player) {
        this.player = player;
    }

    public getTurnsRequired():number {
        return 1;
    }

    public canExecute():boolean {
        var go = this.player.getInventory().get(this.goId);
        if(!go) {
            return false;
        }
        return true;
    }

    public execute() {
        var go = this.player.getInventory().get(this.goId);
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