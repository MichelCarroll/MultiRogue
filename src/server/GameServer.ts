/**
 * Created by michelcarroll on 15-03-24.
 */

///<reference path='../../definitions/vendor/socket.io.d.ts' />
///<reference path='../../definitions/vendor/express3.d.ts' />

var fs = require('fs');

import Player = require('./Player');
import Level = require('./Level');
import LevelGenerator = require('./LevelGenerator');
import Vector2D = require('../common/Vector2D');
import ROT = require('./ROT');
import MessageServer = require('./MessageServer');
import SocketIOMessageServer = require('./SocketIOMessageServer');
import DirectMessageServer = require('./DirectMessageServer');
import MessageDispatcher = require('./MessageDispatcher');
import ServerParameters = require('./ServerParameters');
import Message = require('../common/Message');

class GameServer {

    private level:Level;
    private messageServer:MessageServer;

    constructor(params:ServerParameters) {
        ROT.RNG.setSeed(params.getRandomSeed());
        this.level = (new LevelGenerator()).create();
        if(params.getPort()) {
            this.messageServer = new SocketIOMessageServer(params.getPort());
        } else {
            this.messageServer = new DirectMessageServer();
        }
        this.messageServer.start(this.onConnection.bind(this));
    }

    public getMessageServer():MessageServer {
        return this.messageServer;
    }

    private onConnection(messageDispatcher:MessageDispatcher) {
        var self = this;
        var player:Player = null;

        messageDispatcher.on('ready', function() {
            if(!player) {
                player = self.generatePlayer(messageDispatcher);
            }
        });

        messageDispatcher.on('disconnect', function() {
            if(player) {
                messageDispatcher.broadcast(new Message('player-left', player.getBeing().serialize()));
                self.level.removePlayer(player);
            }
        });

        messageDispatcher.on('shout', function(message:Message) {
            var data = message.getData();
            if(!self.level.canPlay(player)) {
                return;
            }
            messageDispatcher.broadcast(new Message('being-shouted', {'id': player.getBeing().getId(), 'text': data.text}));
            self.level.useTurns(player, 1);
        });

        messageDispatcher.on('being-moved', function(message:Message) {
            var data = message.getData();
            if(!self.level.canPlay(player)) {
                return;
            }

            try {
                self.level.movePlayer(player, new Vector2D(parseInt(data.x), parseInt(data.y)));
            } catch(error) {
                self.handleError(player, error, messageDispatcher);
                return;
            }

            messageDispatcher.broadcast(new Message('being-moved', player.getBeing().serialize()));
            self.level.useTurns(player, 1);
        });

        messageDispatcher.on('being-looked-at-floor', function(message:Message) {
            if(!self.level.canPlay(player)) {
                return;
            }
            messageDispatcher.broadcast(new Message('being-looked-at-floor', player.getBeing().serialize()));
            self.level.useTurns(player, 1);
        });

        messageDispatcher.on('being-picked-up', function(message:Message) {
            var data = message.getData();
            if(!self.level.canPlay(player)) {
                return;
            }

            try {
                self.level.pickUpObject(player, parseInt(data.objectId));
            } catch(error) {
                self.handleError(player, error, messageDispatcher);
                return;
            }

            messageDispatcher.broadcast(new Message('game-object-remove', { 'id': parseInt(data.objectId) }));
            self.level.useTurns(player, 1);
        });

        messageDispatcher.on('being-dropped', function(message:Message) {
            var data = message.getData();
            if(!self.level.canPlay(player)) {
                return;
            }

            try {
                self.level.dropObject(player, parseInt(data.objectId));
            } catch(error) {
                self.handleError(player, error, messageDispatcher);
                return;
            }

            var go = self.level.getObject(parseInt(data.objectId));
            messageDispatcher.broadcast(new Message('game-object-add', go.serialize()));
            self.level.useTurns(player, 1);
        });
    }

    private generatePlayer(messageDispatcher:MessageDispatcher):Player {
        var self = this;
        var player = this.level.addPlayer(function() {
            self.callToStartTurns(player, messageDispatcher);
        });
        messageDispatcher.emit(new Message('initiate', {
            'level': this.level.serialize(),
            'player': player.getBeing().serialize()
        }));
        messageDispatcher.broadcast(new Message('player-came', player.getBeing().serialize()));
        this.level.resume();
        return player;
    }

    private handleError(player:Player, error:Error, messageDispatcher:MessageDispatcher) {
        console.log(error);
        messageDispatcher.emit(new Message('debug', error.message));
        messageDispatcher.broadcast(new Message('player-left', player.getBeing().serialize()));
        this.level.removePlayer(player);
    }

    private callToStartTurns(player:Player, messageDispatcher:MessageDispatcher) {
        messageDispatcher.emit(new Message('its-your-turn', { turns: player.getBeing().getRemainingTurns() }));
        messageDispatcher.broadcast(new Message('its-another-player-turn', {
            'id': player.getBeing().getId(),
            'turns': player.getBeing().getRemainingTurns()
        }));
    }
}

export = GameServer;