
import Command from '../../Command';
import MessageDispatcher from '../../MessageDispatcher';
import Message = require('../../Message');
import GameObject = require('../../GameObject');
import GameObjectLayer = require('../../GameObjectLayer');
import ClientAware from '../../IOC/ClientAware';
import PlayerAware from '../../IOC/PlayerAware';
import GameObjectLayerAware from '../../IOC/GameObjectLayerAware';
import MoveCommand = require('../Move');
import Executor  from '../Executor';

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

    private isOfSameAlliegiance(go:GameObject):boolean {
        return go &&
            go.isAllegiancable() &&
            this.player.isAllegiancable() &&
            go.getAllegiancableComponent().getName() == this.player.getAllegiancableComponent().getName();
    }
g
    public execute() {
        var position = this.player.getPosition().addVector(this.command.getDirection());
        var target = this.goLayer.blocked(position);
        if(target) {
            var effect = this.player.getCollidableComponent().getEffect();
            if(effect && !this.isOfSameAlliegiance(target)) {
                effect.apply(target);
                var message = new Message('effect', { message: effect.getFeedbackMessage(target) });
                this.messageDispatcher.emit(message);
                this.messageDispatcher.broadcast(message);
            }
            else {
                this.messageDispatcher.emit(new Message('effect', { message: 'You bump into ' + target.getName() }));
            }
        }
        else {
            this.goLayer.remove(this.player, this.player.getPosition());
            this.player.setPosition(position);
            this.goLayer.add(this.player, position);
            this.messageDispatcher.broadcast(new Message('being-moved', { actor_id: this.player.getId()}));
        }
    }
}

export = MoveExecutor;