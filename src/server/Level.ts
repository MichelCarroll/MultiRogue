/**
 * Created by michelcarroll on 15-03-29.
 */

///<reference path='../../definitions/rot.d.ts' />

import SpawnPoint = require('./SpawnPoint');
import BeingGenerator = require('./Generators/BeingGenerator');
import Map = require('../common/Map');
import Repository = require('../common/Repository');
import GameObject = require('../common/GameObject');
import Viewpoint = require('../common/Viewpoint');
import GameObjectLayer = require('../common/GameObjectLayer');
import Vector2D = require('../common/Vector2D');
import ROT = require('./ROT');
import Actor = require('./Actor');

class Level  {

    static SPAWN_RADIUS = 5;
    static TURNS_PER_ROUND = 4;
    static MAXIMUM_RANGE = 5;

    private size:Vector2D;
    private goRepository:Repository;
    private gameObjectLayer:GameObjectLayer;
    private playerSpawnPoint:SpawnPoint;
    private fov:ROT.IFOV;
    private scheduler:ROT.Scheduler.Simple;
    private players:Actor[] = [];
    private currentActor:Actor = null;


    constructor(size:Vector2D, goRepository:Repository) {
        this.fov = new ROT.FOV.DiscreteShadowcasting(this.getTileOpacityCallback.bind(this));
        this.gameObjectLayer = new GameObjectLayer();
        this.goRepository = goRepository;
        this.scheduler = new ROT.Scheduler.Simple();
        this.size = size;
    }

    public setActorSpawnSpot(position:Vector2D) {
        var self = this;
        this.playerSpawnPoint = new SpawnPoint(position, Level.SPAWN_RADIUS, function(point:Vector2D):boolean {
            return self.isValidSpawnPoint(point);
        });
    }

    private isValidSpawnPoint(point:Vector2D):boolean {
        return this.gameObjectLayer.getWalkableGameObject(point) && !this.positionHasCollidables(point);
    }

    public addGameObject(go:GameObject) {
        this.goRepository.insert(go);
        this.gameObjectLayer.add(go, go.getPosition());
    }

    public addActor(isPlayer:boolean, callForAction:()=>void) {
        var generator = new BeingGenerator();
        var being = isPlayer ? generator.createPlayer() : generator.createRobot();
        var actor = new Actor(being, callForAction, isPlayer);
        var position = this.playerSpawnPoint.generate();
        being.setPosition(position);
        this.addGameObject(being);
        being.setName(isPlayer ? 'Player #'+being.getId() : 'Robot #'+being.getId());
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

    public moveActor(player:Actor, direction:Vector2D) {
        var position = player.getBeing().getPosition().addVector(direction);
        if(position.distanceFrom(player.getBeing().getPosition()) >= 2) { //diag is ok, and it's 1.4
            throw new Error('Cant move that many spaces away');
        }
        if(!this.gameObjectLayer.getWalkableGameObject(position)) {
            throw new Error('Cant move there, no tile there');
        }
        if(this.positionHasCollidables(position)) {
            throw new Error('Cant move there, being in the way');
        }
        var go = player.getBeing();
        this.gameObjectLayer.remove(go, go.getPosition());
        go.setPosition(position);
        this.gameObjectLayer.add(go, position);
    }

    public pickUpObject(player:Actor, go:GameObject) {
        var being = player.getBeing();
        if(!go.getPosition().equals(being.getPosition())) {
            throw new Error('Actor isn\'t on the same position as the GO');
        }
        else if(!go.isContent()) {
            throw new Error('This GO can\'t be picked up');
        }
        being.getContainerComponent().addToInventory(go);
        this.gameObjectLayer.remove(go, go.getPosition());
    }

    public dropObject(player:Actor, go:GameObject) {
        var being = player.getBeing();
        being.getContainerComponent().removeFromInventory(go);
        go.setPosition(being.getPosition().copy());
        this.gameObjectLayer.add(go, go.getPosition());
    }

    private positionHasCollidables(position:Vector2D):boolean {
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
        return !!this.gameObjectLayer.getWalkableGameObject(new Vector2D(x, y));
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