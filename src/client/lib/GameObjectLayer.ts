/**
 * Created by michelcarroll on 15-04-03.
 */

import GameObject = require('../../common/GameObject');
import Vector2D = require('../../common/Vector2D');

class GameObjectLayer {

    private goStacks: { [position:string] : Array<GameObject> }

    constructor() {
        this.goStacks = {};
    }

    public add(go:GameObject, position:Vector2D) {
        var key = position.toString();
        if(!this.goStacks[key]) {
            this.goStacks[key] = new Array();
        }
        this.goStacks[key].push(go);
        this.sortStack(key);
    }

    public sortStack(stackKey:string) {
        this.goStacks[stackKey].sort(function(a:GameObject,b:GameObject):number {
            if(a.hasComponent('Collidable') === b.hasComponent('Collidable')) {
                return 0;
            }
            else if(!a.hasComponent('Collidable')) {
                return -1;
            }
            return 1;
        })
    }

    public remove(go:GameObject, position:Vector2D) {
        var key = position.toString();
        if(!this.goStacks[key]) {
            return;
        }
        var index = this.findGameObjectIndex(position.toString(), go);
        if(index !== -1) {
            this.goStacks[key].splice(index, 1);
        }
    }

    public blocked(stackKey:string):boolean {
        if(!this.goStacks[stackKey]) {
            return false;
        }
        for(var i = 0; i < this.goStacks[stackKey].length; i++) {
            if(this.goStacks[stackKey][i].hasComponent('Collidable')) {
                return true;
            }
        }
        return false;
    }

    public findGameObjectIndex(stackKey:string, go:GameObject):number {
        for(var i = 0; i < this.goStacks[stackKey].length; i++) {
            if(this.goStacks[stackKey][i].getId() === go.getId()) {
                return i;
            }
        }
        return -1;
    }

    public getTopWalkableGameObject(position:Vector2D):GameObject {
        var key = position.toString();
        if (!this.goStacks[key]) {
            return;
        }
        for (var i = 0; i < this.goStacks[key].length; i++) {
            if (this.goStacks[key][i].hasComponent('Collidable')) {
                return this.goStacks[key][i];
            }
        }
    }

    public getTopPickupableGameObject(position:Vector2D):GameObject {
        var key = position.toString();
        if (!this.goStacks[key]) {
            return;
        }
        for (var i = 0; i < this.goStacks[key].length; i++) {
            if (this.goStacks[key][i].canBePickedUp()) {
                return this.goStacks[key][i];
            }
        }
    }

    public getTopGameObject(position:Vector2D):GameObject {
        var key = position.toString();
        if (!this.goStacks[key] || !this.goStacks[key].length) {
            return;
        }

        return this.goStacks[key][0];
    }

}

export = GameObjectLayer;