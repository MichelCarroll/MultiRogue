/**
 * Created by michelcarroll on 15-03-27.
 */

import GameObject = require('./GameObject');
import GameObjectLayer = require('./GameObjectLayer');
import Vector2D = require('../../common/Vector2D');
import Player = require('./Player');

class Level {

    private gos:{ [id:number] : GameObject };
    private layer:GameObjectLayer;

    constructor() {
        this.layer = new GameObjectLayer();
        this.gos = {};
    }

    public add(go:GameObject) {
        this.gos[go.getId()] = go;
        this.layer.add(go, go.getPosition());
    }

    public get(id:number) {
        if (!this.has(id)) {
            throw new Error('No GO with ID: ' + id);
        }
        return this.gos[id];
    }

    public has(id:number) {
        return this.gos.hasOwnProperty(id.toString());
    }

    public remove(go:GameObject) {
        this.layer.remove(go, go.getPosition());
        delete this.gos[go.getId()];
    }

    public canMoveTo(position:Vector2D):boolean {
        if (this.layer.blocked(position.toString())) {
            return false;
        }
        return true;
    }

    public move(go:GameObject, position:Vector2D):boolean {
        if (!this.canMoveTo(position)) {
            return false;
        }

        this.layer.remove(go, go.getPosition());
        go.setPosition(position);
        this.layer.add(go, go.getPosition());
        return true;
    }


    public pickUpByPlayer(go:GameObject, player:Player) {
        player.addToInventory(go);
        this.remove(go);
    }

    public dropByPlayer(go:GameObject, player:Player) {
        player.removeFromInventory(go);
        go.setPosition(player.getPosition().copy());
        this.add(go);
    }


    public getTopGroundObject(position:Vector2D):GameObject {
        return this.layer.getTopWalkableGameObject(position);
    }

    public getTopItem(position:Vector2D):GameObject {
        return this.layer.getTopPickupableGameObject(position);
    }

    public getGameObjectLayer():GameObjectLayer {
        return this.layer;
    }

}

export = Level;