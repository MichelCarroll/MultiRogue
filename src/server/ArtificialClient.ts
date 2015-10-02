
import GameObject = require('../common/GameObject');
import GameObjectLayer = require('../common/GameObjectLayer');
import Vector2D = require('../common/Vector2D');
import Message = require('../common/Message');
import MessageClient = require('../common/MessageClient');
import DirectMessageClient = require('../common/DirectMessageClient');
import Viewpoint = require('../common/Viewpoint');

import ConnectCommand = require('../common/Commands/Connect');
import MoveCommand = require('../common/Commands/Move');

import ROT = require('./ROT');
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
            self.moveInRandomDirection();
            self.messageClient.send(new Message('idle'));
        });
    }

    private moveInRandomDirection() {
        var positionBag = [
            new Vector2D(1,0),
            new Vector2D(0,1),
            new Vector2D(-1,0),
            new Vector2D(0,-1),
        ];
        for(var i = 0; i < positionBag.length; i++) {
            var index = Math.floor(ROT.RNG.getUniform() * positionBag.length);
            if(!this.attemptMove(positionBag[index])) {
                positionBag.splice(index, 1);
            }
            else {
                return;
            }
        }
    }

    private attemptMove(velocity:Vector2D):boolean {
        var command = new MoveCommand(velocity);
        command.setGameObjectLayer(this.viewpoint.getLayer());
        command.setPlayer(this.viewpoint.getActor());
        command.setMessageClient(this.messageClient);
        var canDo = command.canExecute();
        if(canDo) {
            command.execute();
        }
        return canDo;
    }

}

export = ArtificialClient;