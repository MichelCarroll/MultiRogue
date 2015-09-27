/**
 * Created by michelcarroll on 15-03-27.
 */

import GameObject = require('../../common/GameObject');
import Container = require('../../common/Components/Container');
import Repository = require('../../common/Repository');
import GameObjectLayer = require('./GameObjectLayer');
import Vector2D = require('../../common/Vector2D');

class Level {

    private gos:Repository<GameObject>;
    private layer:GameObjectLayer;

    constructor() {
        this.layer = new GameObjectLayer();
        this.gos = new Repository<GameObject>();
    }

    public add(go:GameObject) {
        this.gos.set(go.getId(),go);
        this.layer.add(go, go.getPosition());
    }

    public get(id:number) {
        var go = this.gos.get(id);
        if (!go) {
            throw new Error('No GO with ID: ' + id);
        }
        return go;
    }

    public has(id:number) {
        return !!this.gos.get(id);
    }

    public remove(go:GameObject) {
        this.layer.remove(go, go.getPosition());
        delete this.gos.delete(go.getId());
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


    public pickUpByPlayer(go:GameObject, player:GameObject) {
        (<Container>player.getComponent('Container')).addToInventory(go);
        this.remove(go);
    }

    public dropByPlayer(go:GameObject, player:GameObject) {
        (<Container>player.getComponent('Container')).removeFromInventory(go);
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