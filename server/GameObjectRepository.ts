/**
 * Created by michelcarroll on 15-03-29.
 */

import Board = require('./Board');
import GameObject = require('./GameObject');
import Coordinate = require('./Coordinate');


class GameObjectRepository {

    private objects: { [id:number] : GameObject };

    constructor() {
        this.objects = {};
    }

    public get(id:number) {
        return this.objects[id];
    }

    public serialize() {
        var beingSerialized = new Array();
        for(var index in this.objects) {
            var being = this.objects[index];
            beingSerialized.push(being.serialize());
        }
        return beingSerialized;
    }

    public delete(gameObject:GameObject) {
        delete this.objects[gameObject.getId()];
    }

    public add(gameObject:GameObject) {
        this.objects[gameObject.getId()] = gameObject;
    }

    public getAll():GameObject[] {
        var self = this;
        return Object.getOwnPropertyNames(this.objects).map(
            function(key) { return self.objects[key]; }
        );
    }

}

export = GameObjectRepository;