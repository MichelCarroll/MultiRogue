/**
 * Created by michelcarroll on 15-03-29.
 */

///<reference path='../../definitions/rot.d.ts' />

import SpawnPoint = require('./SpawnPoint');
import BeingGenerator = require('./Generators/BeingGenerator');
import Repository = require('../common/Repository');
import GameObject = require('../common/GameObject');
import Viewpoint = require('../common/Viewpoint');
import GameObjectLayer = require('../common/GameObjectLayer');
import Vector2D = require('../common/Vector2D');
import ROT = require('./ROT');
import Actor = require('./Actor');

class Level  {

    static TURNS_PER_ROUND = 4;
    static MAXIMUM_RANGE = 5;
    private size:Vector2D;
    private goRepository:Repository<GameObject>;
    private tilesIndex:Repository<GameObject>;
    private gameObjectLayer:GameObjectLayer;
    private numberedTilesIndex:GameObject[];
    private scheduler:ROT.Scheduler.Simple;
    private currentActor:Actor;
    private players:Actor[] = [];
    private playerSpawnPoint:SpawnPoint;
    private nextGOKey:number = 1;
    private fov:ROT.IFOV;

    constructor() {
        this.fov = new ROT.FOV.DiscreteShadowcasting(this.getTileOpacityCallback.bind(this));
        this.gameObjectLayer = new GameObjectLayer();
        this.goRepository = new Repository<GameObject>();
        this.scheduler = new ROT.Scheduler.Simple();
        this.currentActor = null;
        this.tilesIndex = new Repository<GameObject>();
        this.numberedTilesIndex = [];
    }

    public setActorSpawnSpot(position:Vector2D) {
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

    public addActor(isPlayer:boolean, callForAction:()=>void) {
        var id = this.nextGOKey++;
        var name = isPlayer ? 'Player #' + id : 'Robot #' + id;
        var color = isPlayer ? '#FF0' : '#888';
        var allegiance = isPlayer ? 'player' : 'robot';
        var being = BeingGenerator.createActor(id, name, color, allegiance);
        var actor = new Actor(being, callForAction, isPlayer);
        var position = this.playerSpawnPoint.generate();
        being.setPosition(position);
        this.addGameObject(being);
        if(isPlayer) {
            this.addPlayer(actor);
        }
        this.scheduler.add(actor, true);
        return actor;
    }

    public addPlayer(player:Actor) {
        this.players.push(player);
    }

    public removePlayer(player:Actor) {
        this.players.splice(this.players.indexOf(player), 1);
    }

    public isPaused():boolean {
        return (this.currentActor === null);
    }

    public resume() {
        if(!this.currentActor) {
            this.nextTurn();
        }
    }

    public removeActor(actor:Actor) {
        var go = actor.getBeing();
        this.goRepository.delete(go.getId());
        this.gameObjectLayer.remove(go, go.getPosition());
        this.scheduler.remove(actor);
        if(actor.isPlayer()) {
            this.removePlayer(actor);
        }
        if(this.currentActor === actor) {
            this.nextTurn();
        }
    }

    public moveActor(player:Actor, position:Vector2D) {
        if(position.distanceFrom(player.getBeing().getPosition()) >= 2) { //diag is ok, and it's 1.4
            throw new Error('Cant move that many spaces away');
        }
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

    public pickUpObject(player:Actor, goId:number) {
        var being = player.getBeing();
        var go = this.goRepository.get(goId);
        if(!go) {
            throw new Error('No GO with this ID');
        }
        else if(!go.getPosition().equals(being.getPosition())) {
            throw new Error('Actor isn\'t on the same position as the GO');
        }
        else if(!go.isContent()) {
            throw new Error('This GO can\'t be picked up');
        }
        being.getContainerComponent().addToInventory(go);
        this.goRepository.delete(go.getId());
        this.gameObjectLayer.remove(go, go.getPosition());
    }

    public dropObject(player:Actor, goId:number):GameObject {
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

    public canPlay(player:Actor) {
        return (this.currentActor === player && player.getBeing().getPlayableComponent().getRemainingTurns() > 0);
    }

    public useTurns(player:Actor, n:number) {
        player.getBeing().getPlayableComponent().spendTurns(n);
        if(!player.getBeing().getPlayableComponent().getRemainingTurns()) {
            this.nextTurn();
        }
    }

    private nextTurn() {
        this.currentActor = this.scheduler.next();
        if(this.currentActor) {
            this.currentActor.getBeing().getPlayableComponent().giveTurns(Level.TURNS_PER_ROUND);
            this.currentActor.askToTakeTurn();
        }
    }

    public getTileOpacityCallback(x:number, y:number):boolean {
        return this.tilesIndex.has(new Vector2D(x, y).toString());
    }

    public getInitializationInformation() {
        return {
            'players': this.players.map(function(actor:Actor) {
                return {
                    id: actor.getBeing().getId(),
                    name: actor.getBeing().getName()
                }
            }),
            'width': this.size.x,
            'height': this.size.y,
            'current_player_id': this.currentActor ? this.currentActor.getBeing().getId() : null
        };
    }

    public getViewpoint(player:Actor) {
        var playerGO = player.getBeing();
        var cameraPos = playerGO.getPosition();
        var layer = new GameObjectLayer();
        var viewpoint = new Viewpoint();
        var self = this;
        this.fov.compute(cameraPos.x, cameraPos.y, Level.MAXIMUM_RANGE, function(x, y, r) {
            layer.setStack(self.gameObjectLayer.getStackAtPosition(new Vector2D(x, y)), new Vector2D(x, y));
        });
        viewpoint.setLayer(layer);
        viewpoint.setActor(playerGO);
        return viewpoint;
    }

}

export = Level;