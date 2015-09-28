/**
 * Created by michelcarroll on 15-03-29.
 */

///<reference path='../../definitions/rot.d.ts' />

import SpawnPoint = require('./SpawnPoint');
import BeingGenerator = require('./Generators/BeingGenerator');
import Repository = require('../common/Repository');
import GameObject = require('../common/GameObject');
import Viewpoint = require('./Viewpoint');
import GameObjectLayer = require('../common/GameObjectLayer');
import Vector2D = require('../common/Vector2D');
import ROT = require('./ROT');
import Player = require('./Player');

class Level  {

    static TURNS_PER_ROUND = 4;
    private size:Vector2D;
    private goRepository:Repository<GameObject>;
    private tilesIndex:Repository<GameObject>;
    private gameObjectLayer:GameObjectLayer;
    private numberedTilesIndex:GameObject[];
    private scheduler:ROT.Scheduler.Simple;
    private currentPlayer:Player;
    private playerSpawnPoint:SpawnPoint;
    private nextGOKey:number = 1;
    private fov:ROT.IFOV;

    constructor() {
        this.fov = new ROT.FOV.DiscreteShadowcasting(this.getTileOpacityCallback.bind(this));
        this.gameObjectLayer = new GameObjectLayer();
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
            !this.getCollidedGameObjects(point);
    }

    public addTile(go:GameObject) {
        this.addGameObject(go);
        this.tilesIndex.set(go.getPosition().toString(), go);
        this.numberedTilesIndex.push(go);
    }

    public addGameObject(go:GameObject) {
        if(!go.getId()) {
            go.setId(this.nextGOKey++);
        }
        this.goRepository.set(go.getId(), go);
        this.gameObjectLayer.add(go, go.getPosition());
    }

    public addPlayer(callForAction:()=>void) {
        var id = this.nextGOKey++;
        var being = BeingGenerator.createPlayer(id, 'Player #' + id);
        var player = new Player(being, callForAction);
        var position = this.playerSpawnPoint.generate();
        being.setPosition(position);
        this.addGameObject(being);
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
        var go = player.getBeing();
        this.goRepository.delete(go.getId());
        this.gameObjectLayer.remove(go, go.getPosition());
        this.scheduler.remove(player);
        if(this.currentPlayer === player) {
            this.nextTurn();
        }
    }

    public movePlayer(player:Player, position:Vector2D) {
        if(!this.tilesIndex.has(position.toString())) {
            throw new Error('Cant move there, no tile there');
        }
        if(this.getCollidedGameObjects(position)) {
            throw new Error('Cant move there, being in the way');
        }
        var go = player.getBeing();
        this.gameObjectLayer.remove(go, go.getPosition());
        go.setPosition(position);
        this.gameObjectLayer.add(go, position);
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
        this.gameObjectLayer.remove(go, go.getPosition());
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
        this.gameObjectLayer.add(go, go.getPosition());
        return go;
    }

    public getObject(goId:number):GameObject {
        return this.goRepository.get(goId);
    }

    private getCollidedGameObjects(position:Vector2D) {
        return !!this.gameObjectLayer.getCollidableGameObject(position);
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

    public getTileOpacityCallback(x:number, y:number):boolean {
        return this.tilesIndex.has(new Vector2D(x, y).toString());
    }

    public getInitializationInformation() {
        return {
            'players': this.goRepository.getAll().filter(function(go:GameObject) {
                return go.isPlayable();
            }).map(function(go:GameObject) {
                return {
                    id: go.getId(),
                    name: go.getName()
                }
            }),
            'width': this.size.x,
            'height': this.size.y,
            'current_player_id': this.currentPlayer ? this.currentPlayer.getBeing().getId() : null
        };
    }

    public getViewpoint(player:Player) {
        var playerGO = player.getBeing();
        var cameraPos = playerGO.getPosition();
        var layer = new GameObjectLayer();
        var viewpoint = new Viewpoint();
        var self = this;
        this.fov.compute(cameraPos.x, cameraPos.y, 5, function(x, y, r) {
            layer.setStack(self.gameObjectLayer.getStackAtPosition(new Vector2D(x, y)), new Vector2D(x, y));
        });
        viewpoint.setLayer(layer);
        viewpoint.setPlayer(playerGO);
        return viewpoint;
    }

}

export = Level;