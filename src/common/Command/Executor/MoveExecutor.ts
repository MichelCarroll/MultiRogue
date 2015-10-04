
import Command = require('../../Command');
import MessageDispatcher = require('../../MessageDispatcher');
import Message = require('../../Message');
import GameObject = require('../../GameObject');
import GameObjectLayer = require('../../GameObjectLayer');
import ClientAware = require('../../IOC/ClientAware');
import PlayerAware = require('../../IOC/PlayerAware');
import GameObjectLayerAware = require('../../IOC/GameObjectLayerAware');
import MoveCommand = require('../Move');
import Executor = require('../Executor');

class MoveExecutor implements Executor, PlayerAware, GameObjectLayerAware, ClientAware {

    private command:MoveCommand;
    private messageDispatcher:MessageDispatcher;
    private player:GameObject;
    private goLayer:GameObjectLayer;

    constructor(command:MoveCommand) {
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
        var position = this.player.getPosition().addVector(this.command.getDirection());
        this.goLayer.remove(this.player, this.player.getPosition());
        this.player.setPosition(position);
        this.goLayer.add(this.player, position);
        this.messageDispatcher.broadcast(new Message('being-moved', { actor_id: this.player.getId()}));
    }
}

export = MoveExecutor;