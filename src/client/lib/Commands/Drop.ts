
import Command = require('../Command');
import UIAdapter = require('../UIAdapter');
import GameObject = require('../../../common/GameObject');
import MessageClient = require('../MessageClient');
import Message = require('../../../common/Message');
import Container = require('../../../common/Components/Container');
import Vector2D = require('../../../common/Vector2D');

import ServerAware = require('../IOC/ServerAware');
import UIAware = require('../IOC/UIAware');
import PlayerAware = require('../IOC/PlayerAware');

class Drop implements Command, ServerAware, UIAware, PlayerAware {

    private goId:number;
    private messageClient:MessageClient;
    private uiAdapter:UIAdapter;
    private player:GameObject;

    constructor(goId:number) {
        this.goId = goId;
    }

    public setMessageClient(messageClient:MessageClient) {
        this.messageClient = messageClient;
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
        var go = this.player.getContainerComponent().getInventory().get(this.goId);
        if(!go) {
            return false;
        }
        return true;
    }

    public execute() {
        var go = this.player.getContainerComponent().getInventory().get(this.goId);
        this.uiAdapter.logOnUI("You drop the "+go.getName()+".");
        this.uiAdapter.removeItemFromUI(go.getId());
        this.messageClient.send(new Message('being-dropped', {
            'playerId': this.player.getId(),
            'objectId': go.getId()
        }));
    }
}

export = Drop;