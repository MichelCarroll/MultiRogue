/**
 * Created by michelcarroll on 15-03-24.
 */

///<reference path='../../definitions/vendor/socket.io.d.ts' />
///<reference path='../../definitions/vendor/express3.d.ts' />

var fs = require('fs');

import Vector2D = require('../common/Vector2D');
import Playable = require('../common/Components/Playable');
import Message = require('../common/Message');

import ROT = require('./ROT');
import LevelGenerator = require('./Generators/LevelGenerator');
import Player = require('./Player');
import Level = require('./Level');
import MessageServer = require('./MessageServer');
import MessageDispatcher = require('./MessageDispatcher');
import ServerParameters = require('./ServerParameters');

import ArtificialClient = require('./ArtificialClient');
import DirectMessageDispatcher = require('./DirectMessageDispatcher');

class GameServer {

    private level:Level;
    private messageServer:MessageServer;

    constructor(params:ServerParameters) {
        ROT.RNG.setSeed(params.randomSeed);
        this.level = (new LevelGenerator()).create();
        this.messageServer = new MessageServer(params.port);
        this.messageServer.start(this.onConnection.bind(this));

        if(params.includeFakeClient) {
            new ArtificialClient(this.messageServer);
        }
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
                self.level.removePlayer(player);
                messageDispatcher.broadcast(new Message('player-left', {
                    player: player.getBeing()
                }));
            }
        });

        messageDispatcher.on('idle', function() {
            if(!self.level.canPlay(player)) {
                return;
            }
            self.level.useTurns(player, 1);
            messageDispatcher.emit(new Message('sync', { viewpoint: self.level.getViewpoint(player)}));
        });

        messageDispatcher.on('shout', function(message:Message) {
            var data = message.getData();
            if(!self.level.canPlay(player)) {
                return;
            }
            self.level.useTurns(player, 1);
            messageDispatcher.emit(new Message('sync', { viewpoint: self.level.getViewpoint(player)}));
            messageDispatcher.broadcast(new Message('being-shouted', {
                'id': player.getBeing().getId(),
                'name': player.getBeing().getName(),
                'text': data.text
            }));
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

            self.level.useTurns(player, 1);
            messageDispatcher.emit(new Message('sync', { viewpoint: self.level.getViewpoint(player)}));
            messageDispatcher.broadcast(new Message('being-moved', { player: player.getBeing()}));
        });

        messageDispatcher.on('sync-request', function() {
            if(!self.level || !player){
                return;
            }
            messageDispatcher.emit(new Message('sync', { viewpoint: self.level.getViewpoint(player)}));
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

            self.level.useTurns(player, 1);
            messageDispatcher.emit(new Message('sync', { viewpoint: self.level.getViewpoint(player)}));
            messageDispatcher.broadcast(new Message('game-object-remove', { 'id': parseInt(data.objectId) }));
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

            self.level.useTurns(player, 1);
            var go = self.level.getObject(parseInt(data.objectId));
            messageDispatcher.emit(new Message('sync', { viewpoint: self.level.getViewpoint(player)}));
            messageDispatcher.broadcast(new Message('game-object-add', { go: go }));
        });
    }

    private generatePlayer(messageDispatcher:MessageDispatcher):Player {
        var self = this;
        var player = this.level.addPlayer(function() {
            self.callToStartTurns(player, messageDispatcher);
        });
        messageDispatcher.emit(new Message('initiate', {
            'level': this.level.getInitializationInformation(),
            'viewpoint': this.level.getViewpoint(player),
            'player': player.getBeing()
        }));
        messageDispatcher.broadcast(new Message('player-came', {  player: player.getBeing() }));
        this.level.resume();
        return player;
    }

    private handleError(player:Player, error:Error, messageDispatcher:MessageDispatcher) {
        console.log(error);
        messageDispatcher.emit(new Message('debug', error.message));
        messageDispatcher.broadcast(new Message('player-left', {  player: player.getBeing() }));
        this.level.removePlayer(player);
    }

    private callToStartTurns(player:Player, messageDispatcher:MessageDispatcher) {
        messageDispatcher.emit(new Message('its-your-turn', {  player: player.getBeing() }));
        messageDispatcher.broadcast(new Message('its-another-player-turn', {
            'id': player.getBeing().getId(),
            'name': player.getBeing().getName(),
            'turns': player.getBeing().getPlayableComponent().getRemainingTurns()
        }));
    }
}

export = GameServer;