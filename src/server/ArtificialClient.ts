
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

    constructor(messageServer:MessageServer) {
        var self = this;
        this.messageClient = new DirectMessageClient(messageServer, function() {
            self.hookOnEvents();
        });
        this.messageClient.connect();
    }

    private hookOnEvents() {
        var self = this;

        this.messageClient.on('sync', function(message:Message) {
            self.viewpoint = (message.getData().viewpoint);
        });

        this.messageClient.on('initiate', function(message:Message) {
            self.viewpoint = (message.getData().viewpoint);
        });

        this.messageClient.on('its-your-turn', function(message:Message) {
            console.log('my turn!');
            self.viewpoint.setPlayer(message.getData().player);
            var remainingTurns = self.viewpoint.getPlayer().getPlayableComponent().getRemainingTurns();
            var i = 0;
            var timeout = setInterval(function() {
                if(i++ < remainingTurns) {
                    self.messageClient.send(new Message('idle'));
                }
                else {
                    clearTimeout(timeout);
                }
            }, 1000);
        });

        this.messageClient.send(new Message('ready'));
    }


}

export = ArtificialClient;