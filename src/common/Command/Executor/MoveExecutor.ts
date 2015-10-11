
import Command from '../../Command';
import MessageDispatcher from '../../MessageDispatcher';
import Message = require('../../Message');
import GameObject = require('../../GameObject');
import GameObjectLayer = require('../../GameObjectLayer');
import ClientAware from '../../IOC/ClientAware';
import PlayerAware from '../../IOC/PlayerAware';
import GameObjectLayerAware from '../../IOC/GameObjectLayerAware';
import NotifierAware from '../../IOC/NotifierAware';
import MoveCommand = require('../Move');
import Executor  from '../Executor';
import Notifier = require('../../Notifier');
import Effect  from '../../Effect';
import BumpEffect = require('../../Effect/BumpEffect');

class MoveExecutor implements Executor, PlayerAware, GameObjectLayerAware, ClientAware, NotifierAware {

    public static BUMP_NOTIFICATION_RADIUS:number = 5;

    private command:MoveCommand;
    private messageDispatcher:MessageDispatcher;
    private player:GameObject;
    private goLayer:GameObjectLayer;
    private notifier:Notifier;

    constructor(command:MoveCommand) {
        this.command = command;
    }

    public setNotifier(notifier:Notifier) {
        this.notifier = notifier;
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

    private notify(effect:Effect, target:GameObject) {
        this.notifier.notifyByRadius(
            effect.getObserverFeedbackMessage(target),
            target.getPosition(),
            effect.getFeedbackRadius(),
            [target.getId(), this.player.getId()]
        );
        target.notify(effect.getTargetFeedbackMessage(target));
        this.player.notify(effect.getSelfFeedbackMessage(target));
    }

    public execute() {
        var position = this.player.getPosition().addVector(this.command.getDirection());
        var target = this.goLayer.blocked(position);
        if(target) {
            var effect = this.player.getCollidableComponent().getEffect();
            if(!effect || this.isOfSameAlliegiance(target)) {
                effect = new BumpEffect();
                effect.setSource(this.player);
            }
            this.notify(effect, target);
            effect.apply(target);
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