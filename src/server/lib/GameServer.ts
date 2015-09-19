/**
 * Created by michelcarroll on 15-03-24.
 */

///<reference path='../../../definitions/vendor/socket.io.d.ts' />
///<reference path='../../../definitions/vendor/express3.d.ts' />

var fs = require('fs');

import Being = require('./Being');
import BeingGenerator = require('./BeingGenerator');
import Board = require('./Board');
import Level = require('./Level');
import LevelGenerator = require('./LevelGenerator');
import Coordinate = require('./Coordinate');
import ROT = require('./ROT');
import MessageServer = require('./MessageServer');
import SocketIOMessageServer = require('./SocketIOMessageServer');
import MessageDispatcher = require('./MessageDispatcher');
import Message = require('../../common/Message');

class GameServer {

    private level:Level;
    private messageServer:MessageServer;

    constructor() {
        this.level = (new LevelGenerator()).create();
        this.messageServer = new SocketIOMessageServer();
        this.messageServer.start(this.onConnection);
    }

    private onConnection(messageDispatcher:MessageDispatcher) {
        var self = this;
        var player = self.generatePlayer(messageDispatcher);

        messageDispatcher.on('disconnect', function(message:Message) {
            if(player) {
                messageDispatcher.broadcast(new Message('player-left', player.serialize()));
                self.level.removePlayer(player);
            }
        });

        messageDispatcher.on('shout', function(message:Message) {
            var data = message.getData();
            if(!self.level.canPlay(player)) {
                return;
            }
            messageDispatcher.broadcast(new Message('being-shouted', {'id': player.getId(), 'text': data.text}));
            self.level.useTurns(player, 1);
        });

        messageDispatcher.on('being-moved', function(message:Message) {
            var data = message.getData();
            if(!self.level.canPlay(player)) {
                return;
            }

            try {
                self.level.movePlayer(player, new Coordinate(parseInt(data.x), parseInt(data.y)));
            } catch(error) {
                self.handleError(player, error, messageDispatcher);
                return;
            }

            messageDispatcher.broadcast(new Message('being-moved', player.serialize()));
            self.level.useTurns(player, 1);
        });

        messageDispatcher.on('being-looked-at-floor', function(message:Message) {
            if(!self.level.canPlay(player)) {
                return;
            }
            messageDispatcher.broadcast(new Message('being-looked-at-floor', player.serialize()));
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

    private generatePlayer(messageDispatcher:MessageDispatcher):Being {
        var self = this;
        var player = (new BeingGenerator(function() {
            self.callToStartTurns(this, messageDispatcher);
        })).create();

        this.level.addBeing(player);
        messageDispatcher.emit(new Message('initiate', {
            'level': this.level.serialize(),
            'player': player.serialize()
        }));
        messageDispatcher.broadcast(new Message('player-came', player.serialize()));
        this.level.resume();
        return player;
    }

    private handleError(player:Being, error:Error, messageDispatcher:MessageDispatcher) {
        console.log(error);
        messageDispatcher.emit(new Message('debug', error.message));
        messageDispatcher.broadcast(new Message('player-left', player.serialize()));
        this.level.removePlayer(player);
    }

    private callToStartTurns(player:Being, messageDispatcher:MessageDispatcher) {
        messageDispatcher.emit(new Message('its-your-turn', { turns: player.getRemainingTurns() }));
        messageDispatcher.broadcast(new Message('its-another-player-turn', {
            'id': player.getId(),
            'turns': player.getRemainingTurns()
        }));
    }
}

export = GameServer;