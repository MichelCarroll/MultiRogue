
///<reference path='../../definitions/rot.d.ts' />

import GameObject = require('../common/GameObject');
import GameObjectLayer = require('../common/GameObjectLayer');
import Vector2D = require('../common/Vector2D');
import Message = require('../common/Message');
import MessageClient = require('../common/MessageClient');
import DirectMessageClient = require('../common/DirectMessageClient');
import Viewpoint = require('../common/Viewpoint');

import IdleCommand = require('../common/Command/Idle');
import MoveCommand = require('../common/Command/Move');
import ShoutCommand = require('../common/Command/Shout');

import ROT = require('./ROT');
import Actor = require('./Actor');
import MessageServer = require('./MessageServer');


class ArtificialClient {

    private currentTarget:GameObject = null;
    private lastSeen:Vector2D = null;
    private viewpoint:Viewpoint;
    private messageClient:MessageClient;
    private isAloneOnServer = true;

    constructor(messageServer:MessageServer) {
        var self = this;
        this.messageClient = new DirectMessageClient(messageServer, function() {
            self.hookOnEvents();
        });
        this.messageClient.connect();
        this.messageClient.send(new Message('ready', {
            'type': 'ai'
        }));
    }

    private hookOnEvents() {
        var self = this;
        var connectedActors = 0;

        this.messageClient.on('sync', function(message:Message) {
            self.viewpoint = (message.getData().viewpoint);
            self.refreshTarget();
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

        this.messageClient.on('being-moved', function(message:Message) {
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
            if(self.lastSeen) {
                var couldMove = self.moveTowards(self.lastSeen);
                if(!couldMove) {
                    self.lastSeen = null;
                }
                else if(self.viewpoint.getActor().getPosition().equals(self.lastSeen)) {
                    self.shout('Hmm... Where did he go..?');
                    self.lastSeen = null;
                }
            } else {
                self.moveInRandomDirection();
            }
            self.idle();
        });
    }

    private refreshTarget() {
        if(this.currentTarget) {
            this.currentTarget = this.viewpoint.getLayer().findGameObject(this.currentTarget.getId());
            if(this.currentTarget) {
                this.lastSeen = this.currentTarget.getPosition();
            }
        }

        if(!this.currentTarget && !this.lastSeen) {
            this.currentTarget = this.searchClosestPlayer();
            if(this.currentTarget) {
                this.lastSeen = this.currentTarget.getPosition();
                this.shout('*looks at '+this.currentTarget.getName()+'* Fresh meat..');
            }
        }
    }

    private searchClosestPlayer():GameObject {
        var closestPlayer:GameObject = null;
        var currentPos:Vector2D = this.viewpoint.getActor().getPosition();
        this.viewpoint.getLayer().getAllGoWithComponents(['Playable', 'Allegiancable']).forEach(function(being) {
            if(being.getAllegiancableComponent().getName() == 'player'
                && (!closestPlayer
                || (being.getPosition().distanceFrom(currentPos)) < (closestPlayer.getPosition().distanceFrom(currentPos)))) {
                closestPlayer = being;
            }
        });
        return closestPlayer;
    }

    private moveTowards(target:Vector2D):boolean {
        var me = this.viewpoint.getActor().getPosition();
        var velocity = target.subVector(me).getDirectionVector();
        return this.attemptMove(velocity);
    }

    private moveInRandomDirection() {
        var positionBag = [
            new Vector2D(1,0),
            new Vector2D(0,1),
            new Vector2D(-1,0),
            new Vector2D(0,-1),
            new Vector2D(1,1),
            new Vector2D(-1,1),
            new Vector2D(-1,-1),
            new Vector2D(1,-1),
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

    private idle():boolean {
        var command = new IdleCommand();
        var canDo = command.canExecute();
        command.setPlayer(this.viewpoint.getActor());
        if(canDo) {
            this.messageClient.send(new Message('command', {
                command: command
            }));
        }
        return canDo;
    }

    private shout(text:string):boolean {
        var command = new ShoutCommand(text);
        var canDo = command.canExecute();
        if(canDo) {
            this.messageClient.send(new Message('command', {
                command: command
            }));
        }
        return canDo;
    }


    private attemptMove(velocity:Vector2D):boolean {
        var command = new MoveCommand(velocity);
        command.setGameObjectLayer(this.viewpoint.getLayer());
        command.setPlayer(this.viewpoint.getActor());
        var canDo = command.canExecute();
        if(canDo) {
            this.messageClient.send(new Message('command', {
                command: command
            }));
        }
        return canDo;
    }

}

export = ArtificialClient;