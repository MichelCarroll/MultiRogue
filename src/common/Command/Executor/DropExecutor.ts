
import Command = require('../../Command');
import MessageDispatcher = require('../../MessageDispatcher');
import Message = require('../../Message');
import GameObject = require('../../GameObject');
import GameObjectLayer = require('../../GameObjectLayer');
import ClientAware = require('../../IOC/ClientAware');
import PlayerAware = require('../../IOC/PlayerAware');
import GameObjectLayerAware = require('../../IOC/GameObjectLayerAware');
import DropCommand = require('../Drop');
import Executor = require('../Executor');

class DropExecutor implements Executor, PlayerAware, GameObjectLayerAware, ClientAware {

    private command:DropCommand;
    private messageDispatcher:MessageDispatcher;
    private player:GameObject;
    private goLayer:GameObjectLayer;

    constructor(command:DropCommand) {
        this.command = command;
    }

    public setPlayer(player:GameObject) {
        this.player = player;
    }

    public setGameObjectLayer(goLayer:GameObjectLayer) {
        this.goLayer = goLayer;
    }

    public setMessageDispatcher(messageDispatcher:MessageDispatcher) {
        this.messageDispatcher = messageDispatcher;
    }

    public execute() {
        var target = this.command.getTarget();
        this.player.getContainerComponent().removeFromInventory(target);
        target.setPosition(this.player.getPosition().copy());
        this.goLayer.add(target, target.getPosition());
        this.messageDispatcher.broadcast(new Message('game-object-add'));
    }
}

export = DropExecutor;