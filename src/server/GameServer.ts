/**
 * Created by michelcarroll on 15-03-24.
 */

///<reference path='../../definitions/vendor/socket.io.d.ts' />
///<reference path='../../definitions/vendor/express3.d.ts' />

var fs = require('fs');

import Vector2D = require('../common/Vector2D');
import GameObject = require('../common/GameObject');
import Playable = require('../common/Components/Playable');
import Message = require('../common/Message');
import Repository = require('../common/Repository');

import ROT = require('./ROT');
import LevelGenerator = require('./Generators/LevelGenerator');
import Actor = require('./Actor');
import Level = require('./Level');
import MessageServer = require('./MessageServer');
import Command = require('../common/Command');
import MessageDispatcher = require('../common/MessageDispatcher');
import ServerParameters = require('./ServerParameters');

import ArtificialClient = require('./ArtificialClient');
import DirectMessageDispatcher = require('./DirectMessageDispatcher');

class GameServer {

    private level:Level;
    private messageServer:MessageServer;
    private goRepository:Repository;

    constructor(params:ServerParameters) {
        ROT.RNG.setSeed(params.randomSeed);
        this.goRepository = new Repository();
        this.level = (new LevelGenerator(this.goRepository)).create();
        this.messageServer = new MessageServer(this.goRepository, params.port);
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

        messageDispatcher.on('command', function(message:Message) {
            var command:Command = message.getData().command;
            self.inject(command, self.level.getGameObjectLayer(), actor.getBeing(), messageDispatcher);
            if(command.getTurnsRequired() > 0 && !self.level.canPlay(actor)) {
                self.handleError(actor, new Error('Not your turn'), messageDispatcher);
            }
            if(!command.canExecute()) {
                self.handleError(actor, new Error('Can\'t execute'), messageDispatcher);
            }
            var executor = command.getExecutor();
            self.inject(executor, self.level.getGameObjectLayer(), actor.getBeing(), messageDispatcher);
            executor.execute();
            if(command.getTurnsRequired() > 0) {
                self.level.useTurns(actor, command.getTurnsRequired());
            }
            messageDispatcher.emit(new Message('sync', { viewpoint: self.level.getViewpoint(actor)}));
        });

        messageDispatcher.on('sync-request', function() {
            if(!self.level || !actor){
                return;
            }
            messageDispatcher.emit(new Message('sync', { viewpoint: self.level.getViewpoint(actor)}));
        });
    }


    private inject(service:any, goLayer, player, messageDispatcher)
    {
        if(service.setGameObjectLayer) {
            service.setGameObjectLayer(goLayer);
        }
        if(service.setPlayer) {
            service.setPlayer(player);
        }
        if(service.setMessageDispatcher) {
            service.setMessageDispatcher(messageDispatcher);
        }
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