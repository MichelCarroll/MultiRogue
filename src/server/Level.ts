/**
 * Created by michelcarroll on 15-03-29.
 */

import SpawnPoint = require('./SpawnPoint');
import Repository = require('../common/Repository');
import GameObject = require('../common/GameObject');
import Being = require('../common/Being');
import Board = require('./Board');
import Vector2D = require('../common/Vector2D');
import Serializable = require('./../common/Serializable');
import ROT = require('./ROT');
import Player = require('./Player');

class Level implements Serializable {

    static TURNS_PER_ROUND = 4;
    private map:Board;
    private goRepository:Repository<GameObject>;
    private scheduler:ROT.Scheduler.Simple;
    private currentPlayer:Player;
    private playerSpawnPoint:SpawnPoint;

    constructor(map:Board, goRepository:Repository<GameObject>) {
        this.map = map;
        this.goRepository = goRepository;
        this.scheduler = new ROT.Scheduler.Simple();
        this.currentPlayer = null;
        var self = this;
        this.playerSpawnPoint = new SpawnPoint(this.map.getRandomTile(), 5, function(point:Vector2D):boolean {
            return self.isValidSpawnPoint(point);
        });
    }

    private isValidSpawnPoint(point:Vector2D):boolean {
        return this.map.tileExists(point) &&
            !this.getCollidedGameObjects(point).length;
    }

    public addAIBeing(being:Being) {
        this.goRepository.set(being.getId(), being);
    }

    public addImmobile(go:GameObject) {
        this.goRepository.set(go.getId(), go);
    }

    public addPlayer(callForAction:()=>void) {
        var being = new Being();
        being.setId(this.goRepository.getFreeKey());
        var player = new Player(being, callForAction);
        var position = this.playerSpawnPoint.generate();
        being.setPosition(position);
        this.goRepository.set(being.getId(), being);
        this.scheduler.add(player, true);
        return player;
    }

    public isPaused():boolean {
        return (this.currentPlayer === null);
    }

    public resume() {
        if(!this.currentPlayer) {
            this.nextTurn();
        }
    }

    public removePlayer(player:Player) {
        this.goRepository.delete(player.getBeing().getId());
        this.scheduler.remove(player);
        if(this.currentPlayer === player) {
            this.nextTurn();
        }
    }

    public movePlayer(player:Player, position:Vector2D) {
        if(!this.map.tileExists(position)) {
            throw new Error('Cant move there, no tile there');
        }
        if(this.getCollidedGameObjects(position).length) {
            throw new Error('Cant move there, being in the way');
        }
        player.getBeing().setPosition(position);
    }

    public pickUpObject(player:Player, goId:number) {
        var being = player.getBeing();
        var go = this.goRepository.get(goId);
        if(!go) {
            throw new Error('No GO with this ID');
        }
        else if(!go.getPosition().equals(being.getPosition())) {
            throw new Error('Player isn\'t on the same position as the GO');
        }
        else if(!go.canBePickedUp()) {
            throw new Error('This GO can\'t be picked up');
        }
        being.addToInventory(go);
        this.goRepository.delete(go.getId());
    }

    public dropObject(player:Player, goId:number):GameObject {
        var being = player.getBeing();
        var go = being.getInventory().get(goId);
        if(!go) {
            throw new Error('No GO with this ID');
        }
        being.removeFromInventory(go);
        go.setPosition(being.getPosition().copy());
        this.goRepository.set(go.getId(), go);
        return go;
    }

    public getObject(goId:number):GameObject {
        return this.goRepository.get(goId);
    }

    private getCollidedGameObjects(position:Vector2D) {
        return this.goRepository.getAll().filter(function(element:GameObject, index, array) {
            return !element.canBeWalkedThrough() && element.getPosition().equals(position);
        });
    }

    public canPlay(player:Player) {
        return (this.currentPlayer === player && player.getBeing().getRemainingTurns() > 0);
    }

    public useTurns(player:Player, n:number) {
        player.getBeing().spendTurns(n);
        if(!player.getBeing().getRemainingTurns()) {
            this.nextTurn();
        }
    }

    private nextTurn() {
        this.currentPlayer = this.scheduler.next();
        if(this.currentPlayer) {
            this.currentPlayer.getBeing().giveTurns(Level.TURNS_PER_ROUND);
            this.currentPlayer.askToTakeTurn();
        }
    }

    public serialize() {
        return {
            'map': this.map.getTileMap(),
            'gameObjects': this.goRepository.serialize(),
            'width': this.map.getWidth(),
            'height': this.map.getHeight(),
            'current_player_id': this.currentPlayer ? this.currentPlayer.getBeing().getId() : null
        };
    }

    public deserialize(data:any) {

    }

}

export = Level;