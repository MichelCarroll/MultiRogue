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
import Actor = require('./Actor');
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

        var numBots = params.numberFollowBots ? params.numberFollowBots : 0;
        for(var i = 0; i < numBots; i++) {
            new ArtificialClient(this.messageServer);
        }
    }

    public getMessageServer():MessageServer {
        return this.messageServer;
    }

    private onConnection(messageDispatcher:MessageDispatcher) {
        var self = this;
        var actor:Actor = null;

        messageDispatcher.on('ready', function(message:Message) {
            if(!actor) {
                actor = self.generateActor(messageDispatcher, message.getData().type == 'player');
            }
        });

        messageDispatcher.on('disconnect', function() {
            if(actor) {
                self.level.removeActor(actor);

                if(actor.isPlayer()) {
                    messageDispatcher.broadcast(new Message('player-left', { player: actor.getBeing() }));
                } else {
                    messageDispatcher.broadcast(new Message('actor-left', { actor: actor.getBeing() }));
                }
            }
        });

        messageDispatcher.on('idle', function() {
            if(!self.level.canPlay(actor)) {
                return;
            }
            self.level.useTurns(actor, actor.getBeing().getPlayableComponent().getRemainingTurns());
        });

        messageDispatcher.on('shout', function(message:Message) {
            var data = message.getData();
            messageDispatcher.emit(new Message('sync', { viewpoint: self.level.getViewpoint(actor)}));
            messageDispatcher.broadcast(new Message('being-shouted', {
                'id': actor.getBeing().getId(),
                'name': actor.getBeing().getName(),
                'text': data.text
            }));
        });

        messageDispatcher.on('being-moved', function(message:Message) {
            var data = message.getData();
            if(!self.level.canPlay(actor)) {
                return;
            }

            try {
                self.level.moveActor(actor, new Vector2D(parseInt(data.x), parseInt(data.y)));
            } catch(error) {
                self.handleError(actor, error, messageDispatcher);
                return;
            }

            self.level.useTurns(actor, 1);
            messageDispatcher.emit(new Message('sync', { viewpoint: self.level.getViewpoint(actor)}));
            messageDispatcher.broadcast(new Message('being-moved', { actor_id: actor.getBeing().getId()}));
        });

        messageDispatcher.on('sync-request', function() {
            if(!self.level || !actor){
                return;
            }
            messageDispatcher.emit(new Message('sync', { viewpoint: self.level.getViewpoint(actor)}));
        });

        messageDispatcher.on('being-picked-up', function(message:Message) {
            var data = message.getData();
            if(!self.level.canPlay(actor)) {
                return;
            }

            try {
                self.level.pickUpObject(actor, parseInt(data.objectId));
            } catch(error) {
                self.handleError(actor, error, messageDispatcher);
                return;
            }

            self.level.useTurns(actor, 1);
            messageDispatcher.emit(new Message('sync', { viewpoint: self.level.getViewpoint(actor)}));
            messageDispatcher.broadcast(new Message('game-object-remove', { 'id': parseInt(data.objectId) }));
        });

        messageDispatcher.on('being-dropped', function(message:Message) {
            var data = message.getData();
            if(!self.level.canPlay(actor)) {
                return;
            }

            try {
                self.level.dropObject(actor, parseInt(data.objectId));
            } catch(error) {
                self.handleError(actor, error, messageDispatcher);
                return;
            }

            self.level.useTurns(actor, 1);
            var go = self.level.getObject(parseInt(data.objectId));
            messageDispatcher.emit(new Message('sync', { viewpoint: self.level.getViewpoint(actor)}));
            messageDispatcher.broadcast(new Message('game-object-add', { go: go }));
        });
    }

    private generateActor(messageDispatcher:MessageDispatcher, isPlayer:boolean):Actor {
        var self = this;
        var actor = this.level.addActor(isPlayer, function() {
            self.callToStartTurns(actor, messageDispatcher);
        });
        messageDispatcher.emit(new Message('initiate', {
            'level': this.level.getInitializationInformation(),
            'viewpoint': this.level.getViewpoint(actor),
            'player': actor.getBeing()
        }));
        if(isPlayer) {
            messageDispatcher.broadcast(new Message('player-came', {  player: actor.getBeing() }));
        } else {
            messageDispatcher.broadcast(new Message('actor-came', {  actor: actor.getBeing() }));
        }
        this.level.resume();
        return actor;
    }

    private handleError(actor:Actor, error:Error, messageDispatcher:MessageDispatcher) {
        console.log(error);
        messageDispatcher.emit(new Message('debug', error.message));
        if(actor.isPlayer()) {
            messageDispatcher.broadcast(new Message('player-left', {  player: actor.getBeing() }));
        } else {
            messageDispatcher.broadcast(new Message('actor-left', {  actor: actor.getBeing() }));
        }
        this.level.removeActor(actor);
    }

    private callToStartTurns(actor:Actor, messageDispatcher:MessageDispatcher) {
        messageDispatcher.emit(new Message('its-your-turn', {  player: actor.getBeing() }));
        if(actor.isPlayer()) {
            messageDispatcher.broadcast(new Message('its-another-player-turn', {
                'id': actor.getBeing().getId(),
                'name': actor.getBeing().getName(),
                'turns': actor.getBeing().getPlayableComponent().getRemainingTurns()
            }));
        }
    }
}

export = GameServer;