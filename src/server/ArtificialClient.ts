
import GameObject = require('../common/GameObject');
import GameObjectLayer = require('../common/GameObjectLayer');
import Message = require('../common/Message');
import MessageClient = require('../common/MessageClient');
import DirectMessageClient = require('../common/DirectMessageClient');
import ConnectCommand = require('../common/Commands/Connect');
import Viewpoint = require('../common/Viewpoint');

import Actor = require('./Actor');
import MessageServer = require('./MessageServer');


class ArtificialClient {

    private viewpoint:Viewpoint;
    private messageClient:MessageClient;
    private isAloneOnServer = true;

    constructor(messageServer:MessageServer) {
        var self = this;
        this.messageClient = new DirectMessageClient(messageServer, function() {
            self.hookOnEvents();
        });
        var command = new ConnectCommand(ConnectCommand.AI);
        command.setMessageClient(this.messageClient);
        command.execute();
    }

    private hookOnEvents() {
        var self = this;
        var connectedActors = 0;

        this.messageClient.on('sync', function(message:Message) {
            self.viewpoint = (message.getData().viewpoint);
            self.takeTurnIfApplicable();
        });

        this.messageClient.on('player-came', function(message:Message) {
            connectedActors++;
            self.isAloneOnServer = connectedActors == 0;
            self.messageClient.send(new Message('sync-request'));
        });

        this.messageClient.on('player-left', function(message:Message) {
            connectedActors--;
            self.isAloneOnServer = connectedActors == 0;
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
            self.messageClient.send(new Message('idle'));
        });
    }

}

export = ArtificialClient;