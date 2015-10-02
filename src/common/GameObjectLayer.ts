/**
 * Created by michelcarroll on 15-04-03.
 */

import GameObject = require('./GameObject');
import Vector2D = require('./Vector2D');
import Serializer = require('./Serializer');
import Serializable = require('./Serializable');

class GameObjectLayer implements Serializable {

    private goStacks: { [position:string] : Array<GameObject> }

    constructor() {
        this.goStacks = {};
    }

    public empty() {
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

    public setStack(goStack:GameObject[], position:Vector2D) {
        this.goStacks[position.toString()] = goStack;
    }

    public sortStack(stackKey:string) {
        this.goStacks[stackKey].sort(function(a:GameObject,b:GameObject):number {
            var aLayer = a.isRenderable() ? a.getRenderableComponent().getLayer() : 0;
            var bLayer = b.isRenderable() ? b.getRenderableComponent().getLayer() : 0;
            return bLayer - aLayer;
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

    public blocked(position:Vector2D):boolean {
        var stackKey = position.toString();
        if(!this.goStacks[stackKey]) {
            return false;
        }
        for(var i = 0; i < this.goStacks[stackKey].length; i++) {
            if(this.goStacks[stackKey][i].isCollidable()) {
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

    public getStackAtPosition(position:Vector2D):Array<GameObject> {
        var stack = this.goStacks[position.toString()];
        return stack ? stack : [];
    }

    public getNonCollidableGameObject(position:Vector2D):GameObject {
        return this.getFirstGOWithoutComponent(position, 'Collidable');
    }

    public getCollidableGameObject(position:Vector2D):GameObject {
        return this.getFirstGOWithComponent(position, 'Collidable');
    }

    public getTopPickupableGameObject(position:Vector2D):GameObject {
        return this.getFirstGOWithComponent(position, 'Content');
    }

    public getWalkableGameObject(position:Vector2D):GameObject {
        return this.getFirstGOWithComponent(position, 'Walkable');
    }

    public getTopRenderableGameObject(position:Vector2D):GameObject {
        return this.getFirstGOWithComponent(position, 'Renderable');
    }

    public getAllGoWithComponents(componentNames:string[]):GameObject[] {
        var gos = [];
        var self = this;
        Object.getOwnPropertyNames(this.goStacks).forEach(function(key) {
            Array.prototype.push.apply(gos, self.goStacks[key].filter(function(go:GameObject) {
                for(var i = 0; i < componentNames.length; i++) {
                    if(!go.hasComponent(componentNames[i])) {
                        return false;
                    }
                }
                return true;
            }));
        });
        return gos;
    }

    public getFirstGOWithoutComponent(position:Vector2D, componentName:string):GameObject {
        var key = position.toString();
        if (!this.goStacks[key]) {
            return;
        }
        for (var i = 0; i < this.goStacks[key].length; i++) {
            if (!this.goStacks[key][i].hasComponent(componentName)) {
                return this.goStacks[key][i];
            }
        }
    }

    public getFirstGOWithComponent(position:Vector2D, componentName:string):GameObject {
        var key = position.toString();
        if (!this.goStacks[key]) {
            return;
        }
        for (var i = 0; i < this.goStacks[key].length; i++) {
            if (this.goStacks[key][i].hasComponent(componentName)) {
                return this.goStacks[key][i];
            }
        }
    }

    public serialize():any {
        var data = {};
        for (var key in this.goStacks) {
            if (this.goStacks.hasOwnProperty(key)) {
                data[key] = this.goStacks[key].map(function(go:GameObject) {
                   return go.serialize();
                });
            }
        }
        return data;
    }

    public deserialize(data:any) {
        this.goStacks = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                this.goStacks[key] = data[key].map(function(dataGo:any) {
                    var go = new GameObject();
                    go.deserialize(dataGo);
                    return go;
                });
            }
        }
    }
}

export = GameObjectLayer;