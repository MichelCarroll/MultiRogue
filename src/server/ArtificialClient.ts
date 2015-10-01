
import GameObject = require('../common/GameObject');
import GameObjectLayer = require('../common/GameObjectLayer');
import Message = require('../common/Message');
import MessageClient = require('../common/MessageClient');
import Viewpoint = require('../common/Viewpoint');

import Player = require('./Player');


class ArtificialClient {

    private viewpoint:Viewpoint;
    private messageClient:MessageClient;

    constructor(viewpoint:Viewpoint, messageClient:MessageClient) {
        this.viewpoint = viewpoint;
        this.messageClient = messageClient;
        this.hookOnEvents();
    }

    private hookOnEvents() {
        var self = this;

        this.messageClient.on('sync', function(message:Message) {
            self.viewpoint = (message.getData().viewpoint);
        });

        this.messageClient.on('its-your-turn', function(message:Message) {
            while(self.viewpoint.getPlayer().getPlayableComponent().getRemainingTurns() > 0) {
                self.messageClient.send(new Message('idle'));
            }
        });
    }


}

export = ArtificialClient