
import Command from '../../Command';
import MessageDispatcher from '../../MessageDispatcher';
import Message = require('../../Message');
import GameObject = require('../../GameObject');
import GameObjectLayer = require('../../GameObjectLayer');


import ClientAware from '../../IOC/ClientAware';
import PlayerAware from '../../IOC/PlayerAware';
import GameObjectLayerAware from '../../IOC/GameObjectLayerAware';
import PickUpCommand = require('../PickUp');
import Executor  from '../Executor';

class PickUpExecutor implements Executor, PlayerAware, GameObjectLayerAware, ClientAware {

    private command:PickUpCommand;
    private messageDispatcher:MessageDispatcher;
    private player:GameObject;
    private goLayer:GameObjectLayer;

    constructor(command:PickUpCommand) {
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
        var go = this.goLayer.getTopPickupableGameObject(this.player.getPosition());
        this.player.getContainerComponent().addToInventory(go);
        this.goLayer.remove(go, go.getPosition());
        this.messageDispatcher.broadcast(new Message('game-object-remove'));
    }
}

export = PickUpExecutor;