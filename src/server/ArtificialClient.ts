
import GameObject = require('../common/GameObject');
import GameObjectLayer = require('../common/GameObjectLayer');
import Message = require('../common/Message');
import MessageClient = require('../common/MessageClient');
import DirectMessageClient = require('../common/DirectMessageClient');
import Viewpoint = require('../common/Viewpoint');

import Player = require('./Player');
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
        this.messageClient.connect();
    }

    private hookOnEvents() {
        var self = this;
        var connectedPlayers = 0;

        this.messageClient.on('sync', function(message:Message) {
            self.viewpoint = (message.getData().viewpoint);
            self.takeTurnIfApplicable();
        });

        this.messageClient.on('player-came', function(message:Message) {
            connectedPlayers++;
            self.isAloneOnServer = connectedPlayers == 0;
            self.messageClient.send(new Message('sync-request'));
        });

        this.messageClient.on('player-left', function(message:Message) {
            connectedPlayers--;
            self.isAloneOnServer = connectedPlayers == 0;
            this.messageClient.send(new Message('sync-request'));
        });

        this.messageClient.on('initiate', function(message:Message) {
            self.viewpoint = message.getData().viewpoint;
            connectedPlayers = message.getData().level.players.length;
            self.isAloneOnServer = connectedPlayers == 0;
        });

        this.messageClient.on('its-your-turn', function(message:Message) {
            self.viewpoint.setPlayer(message.getData().player);
            self.takeTurnIfApplicable();
        });

        this.messageClient.send(new Message('ready'));
    }

    private takeTurnIfApplicable() {
        var remainingTurns = this.viewpoint.getPlayer().getPlayableComponent().getRemainingTurns();
        if(remainingTurns == 0 || this.isAloneOnServer) {
            return;
        }
        this.messageClient.send(new Message('idle'));
    }

}

export = ArtificialClient;