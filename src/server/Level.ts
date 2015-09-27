/**
 * Created by michelcarroll on 15-03-29.
 */

import SpawnPoint = require('./SpawnPoint');
import BeingGenerator = require('./Generators/BeingGenerator');
import Repository = require('../common/Repository');
import GameObject = require('../common/GameObject');
import Vector2D = require('../common/Vector2D');
import Serializable = require('./../common/Serializable');
import ROT = require('./ROT');
import Player = require('./Player');

class Level implements Serializable {

    static TURNS_PER_ROUND = 4;
    private size:Vector2D;
    private goRepository:Repository<GameObject>;
    private tilesIndex:Repository<GameObject>;
    private numberedTilesIndex:GameObject[];
    private scheduler:ROT.Scheduler.Simple;
    private currentPlayer:Player;
    private playerSpawnPoint:SpawnPoint;
    private nextGOKey:number = 1;

    constructor() {
        this.goRepository = new Repository<GameObject>();
        this.scheduler = new ROT.Scheduler.Simple();
        this.currentPlayer = null;
        this.tilesIndex = new Repository<GameObject>();
        this.numberedTilesIndex = [];
    }

    public setPlayerSpawnSpot(position:Vector2D) {
        var self = this;
        this.playerSpawnPoint = new SpawnPoint(position, 5, function(point:Vector2D):boolean {
            return self.isValidSpawnPoint(point);
        });
    }

    public setSize(size:Vector2D) {
        this.size = size;
    }

    public getRandomTile():GameObject {
        if(!this.numberedTilesIndex.length) {
            return null;
        }
        var index = Math.floor(ROT.RNG.getUniform() * this.numberedTilesIndex.length);
        return this.numberedTilesIndex[index];
    }

    private isValidSpawnPoint(point:Vector2D):boolean {
        return this.tilesIndex.has(point.toString()) &&
            !this.getCollidedGameObjects(point).length;
    }

    public addTile(go:GameObject) {
        this.addGameObject(go);
        this.tilesIndex.set(go.getPosition().toString(), go);
        this.numberedTilesIndex.push(go);
    }

    public addGameObject(go:GameObject) {
        go.setId(this.nextGOKey++);
        this.goRepository.set(go.getId(), go);
    }

    public addPlayer(callForAction:()=>void) {
        var id = this.nextGOKey++;
        var being = BeingGenerator.createPlayer(id, 'Player #' + id);
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
        if(!this.tilesIndex.has(position.toString())) {
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
        else if(!go.isContent()) {
            throw new Error('This GO can\'t be picked up');
        }
        being.getContainerComponent().addToInventory(go);
        this.goRepository.delete(go.getId());
    }

    public dropObject(player:Player, goId:number):GameObject {
        var being = player.getBeing();
        var go = being.getContainerComponent().getInventory().get(goId);
        if(!go) {
            throw new Error('No GO with this ID');
        }
        being.getContainerComponent().removeFromInventory(go);
        go.setPosition(being.getPosition().copy());
        this.goRepository.set(go.getId(), go);
        return go;
    }

    public getObject(goId:number):GameObject {
        return this.goRepository.get(goId);
    }

    private getCollidedGameObjects(position:Vector2D) {
        return this.goRepository.getAll().filter(function(element:GameObject, index, array) {
            return element.isCollidable() && element.getPosition().equals(position);
        });
    }

    public canPlay(player:Player) {
        return (this.currentPlayer === player && player.getBeing().getPlayableComponent().getRemainingTurns() > 0);
    }

    public useTurns(player:Player, n:number) {
        player.getBeing().getPlayableComponent().spendTurns(n);
        if(!player.getBeing().getPlayableComponent().getRemainingTurns()) {
            this.nextTurn();
        }
    }

    private nextTurn() {
        this.currentPlayer = this.scheduler.next();
        if(this.currentPlayer) {
            this.currentPlayer.getBeing().getPlayableComponent().giveTurns(Level.TURNS_PER_ROUND);
            this.currentPlayer.askToTakeTurn();
        }
    }

    public serialize() {
        return {
            'gameObjects': this.goRepository.serialize(),
            'width': this.size.x,
            'height': this.size.y,
            'current_player_id': this.currentPlayer ? this.currentPlayer.getBeing().getId() : null
        };
    }

    public deserialize(data:any) {

    }

}

export = Level;