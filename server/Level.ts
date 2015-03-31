/**
 * Created by michelcarroll on 15-03-29.
 */

///<reference path='./ts-definitions/node.d.ts' />

var fs = require('fs');
eval(fs.readFileSync(__dirname+'/node_modules/rot.js/rot.js/rot.js','utf8'));

import GameObjectRepository = require('./GameObjectRepository');
import GameObject = require('./GameObject');
import Being = require('./Being');
import Board = require('./Board');
import Coordinate = require('./Coordinate');

class Level {

    static TURNS_PER_ROUND = 4;
    private map:Board;
    private goRepository:GameObjectRepository;
    private scheduler:ROT.Scheduler.Simple;
    private currentPlayer:Being;

    constructor(map:Board) {
        this.map = map;
        this.goRepository = new GameObjectRepository();
        this.scheduler = new ROT.Scheduler.Simple();
        this.currentPlayer = null;
    }

    public addAIBeing(being:Being) {
        this.goRepository.add(being);
    }

    public addImmobile(go:GameObject) {
        this.goRepository.add(go);
    }

    public createNewPlayer(takeTurnCallback:()=>void):Being {
        var position = this.map.getRandomTile();
        var player = new Being(position, takeTurnCallback);
        this.goRepository.add(player);
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

    public removePlayer(player:Being) {
        this.goRepository.delete(player);
        this.scheduler.remove(player);
        if(this.currentPlayer === player) {
            this.nextTurn();
        }
    }

    public movePlayer(player:Being, position:Coordinate) {
        if(!this.map.tileExists(position)) {
            throw new Error('Cant move there, no tile there');
        }
        if(this.getCollidedGameObjects(position).length) {
            throw new Error('Cant move there, being in the way');
        }
        player.setPosition(position);
    }

    private getCollidedGameObjects(position:Coordinate) {
        return this.goRepository.getAll().filter(function(element:GameObject, index, array) {
            return !element.canBeWalkedThrough() && element.getPosition().equals(position);
        });
    }

    public canPlay(player:Being) {
        return (this.currentPlayer === player && player.getRemainingTurns() > 0);
    }

    public useTurns(player:Being, n:number) {
        player.spendTurns(n);
        if(!player.getRemainingTurns()) {
            this.nextTurn();
        }
    }

    private nextTurn() {
        this.currentPlayer = this.scheduler.next();
        if(this.currentPlayer) {
            this.currentPlayer.giveTurns(Level.TURNS_PER_ROUND);
            this.currentPlayer.askToTakeTurn();
        }
    }

    public serialize() {
        return {
            'map': this.map.getTileMap(),
            'gameObjects': this.goRepository.serialize(),
            'width': this.map.getWidth(),
            'height': this.map.getHeight(),
            'current_player_id': this.currentPlayer ? this.currentPlayer.getId() : null
        };
    }

}

export = Level;