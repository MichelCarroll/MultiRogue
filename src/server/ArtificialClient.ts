

import GameObjectLayer = require('../common/GameObjectLayer');
import Message = require('../common/Message');
import MessageClient from '../common/MessageClient';
import DirectMessageClient = require('../common/DirectMessageClient');
import Viewpoint = require('../common/Viewpoint');


import Command from '../common/Command';
import Behaviour from './Behaviour';
import WanderBehaviour from './Behaviour/WanderBehaviour';

import Actor = require('./Actor');
import MessageServer = require('./MessageServer');


class ArtificialClient {

    private viewpoint:Viewpoint;
    private messageClient:MessageClient;
    private isAloneOnServer = true;
    private behaviour:Behaviour = null;

    constructor(messageServer:MessageServer) {
        var self = this;
        this.behaviour = new WanderBehaviour(this.getViewpoint.bind(this), this.executeCommand.bind(this));
        this.messageClient = new DirectMessageClient(messageServer, function() {
            self.hookOnEvents();
        });
        this.messageClient.connect();
        this.messageClient.send(new Message('ready', {
            'type': 'ai'
        }));
    }

    private hookOnEvents() {
        var self = this;
        var connectedActors = 0;

        this.messageClient.on('sync', function(message:Message) {
            self.viewpoint = (message.getData().viewpoint);
            self.behaviour.refresh();
        });

        this.messageClient.on('player-came', function(message:Message) {
            connectedActors++;
            self.isAloneOnServer = connectedActors == 0;
            self.messageClient.send(new Message('sync-request'));
            self.takeTurnIfApplicable();
        });

        this.messageClient.on('player-left', function(message:Message) {
            connectedActors--;
            self.isAloneOnServer = connectedActors == 0;
            self.messageClient.send(new Message('sync-request'));
            self.takeTurnIfApplicable();
        });

        this.messageClient.on('being-moved', function(message:Message) {
            self.messageClient.send(new Message('sync-request'));
        });

        this.messageClient.on('initiate', function(message:Message) {
            self.viewpoint = message.getData().viewpoint;
            connectedActors = message.getData().level.players.length;
            self.isAloneOnServer = connectedActors == 0;
        });

        this.messageClient.on('its-your-turn', function(message:Message) {
            self.viewpoint.setActor(message.getData().player);
            self.takeTurnIfApplicable();
        });

        this.messageClient.send(new Message('ready', {
            'type': 'ai'
        }));
    }

    private takeTurnIfApplicable() {
        var remainingTurns = this.viewpoint.getActor().getPlayableComponent().getRemainingTurns();
        if(remainingTurns == 0 || this.isAloneOnServer) {
            return;
        }
        var self = this;
        setImmediate(function() {
            self.behaviour.performAction();
        });
    }

    private executeCommand(command:Command) {
        this.messageClient.send(new Message('command', {
            command: command
        }));
    }

    private getViewpoint() {
        return this.viewpoint;
    }

}

export = ArtificialClient;