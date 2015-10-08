
import Command from '../../Command';
import GameObject = require('../../GameObject');
import MessageDispatcher from '../../MessageDispatcher';
import Message = require('../../Message');

import ClientAware from '../../IOC/ClientAware';
import PlayerAware from '../../IOC/PlayerAware';
import ShoutCommand = require('../Shout');
import Executor  from '../Executor';

class ShoutExecutor implements Executor, ClientAware, PlayerAware {

    private command:ShoutCommand;
    private player:GameObject;
    private messageDispatcher:MessageDispatcher;

    constructor(command:ShoutCommand) {
        this.command = command;
    }

    public setPlayer(player:GameObject) {
        this.player = player;
    }

    public setMessageDispatcher(messageDispatcher:MessageDispatcher) {
        this.messageDispatcher = messageDispatcher;
    }

    public execute() {
        this.messageDispatcher.broadcast(new Message('being-shouted', {
            'name': this.player.getName(),
            'text': this.command.getText()
        }));
    }
}

export = ShoutExecutor;