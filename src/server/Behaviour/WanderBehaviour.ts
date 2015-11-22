
///<reference path='../../../definitions/rot.d.ts' />

import ROT = require('../ROT');

import Behaviour from '../Behaviour';
import Viewpoint = require('./../../common/Viewpoint');

import Vector2D = require('../../common/Vector2D');
import GameObject = require('../../common/GameObject');

import Command from '../../common/Command';
import IdleCommand = require('../../common/Command/Idle');
import MoveCommand = require('../../common/Command/Move');
import ShoutCommand = require('../../common/Command/Shout');

class WanderBehaviour implements Behaviour
{
    private getViewpoint:()=>Viewpoint = null;
    private execute:(cmd:Command)=>void = null;
    private currentTarget:GameObject = null;
    private lastSeen:Vector2D = null;

    constructor(getViewpoint:()=>Viewpoint, execute:(cmd:Command)=>void) {
        this.getViewpoint = getViewpoint;
        this.execute = execute;
    }

    public performAction() {
        if(this.lastSeen) {
            var couldMove = this.moveTowards(this.lastSeen);
            if(!couldMove) {
                this.lastSeen = null;
            }
            else if(this.getViewpoint().getActor().getPosition().equals(this.lastSeen)) {
                this.shout('Hmm... Where did he go..?');
                this.lastSeen = null;
            }
        } else {
            this.moveInRandomDirection();
        }
        this.idle();
    }

    public refresh() {
        if(this.currentTarget) {
            this.currentTarget = this.getViewpoint().getLayer().findGameObject(this.currentTarget.getId());
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
        var currentPos:Vector2D = this.getViewpoint().getActor().getPosition();
        this.getViewpoint().getLayer().getAllGoWithComponents(['Playable', 'Allegiancable']).forEach(function(being) {
            if(being.getAllegiancableComponent().getName() == 'player'
                && (!closestPlayer
                || (being.getPosition().distanceFrom(currentPos)) < (closestPlayer.getPosition().distanceFrom(currentPos)))) {
                closestPlayer = being;
            }
        });
        return closestPlayer;
    }

    private moveTowards(target:Vector2D):boolean {
        var me = this.getViewpoint().getActor().getPosition();
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
        command.setPlayer(this.getViewpoint().getActor());
        if(canDo) {
            this.execute(command);
        }
        return canDo;
    }

    private shout(text:string):boolean {
        var command = new ShoutCommand(text);
        var canDo = command.canExecute();
        if(canDo) {
            this.execute(command);
        }
        return canDo;
    }


    private attemptMove(velocity:Vector2D):boolean {
        var command = new MoveCommand(velocity);
        command.setGameObjectLayer(this.getViewpoint().getLayer());
        command.setPlayer(this.getViewpoint().getActor());
        var canDo = command.canExecute();
        if(canDo) {
            this.execute(command);
        }
        return canDo;
    }

}

export default WanderBehaviour;