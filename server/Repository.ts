/**
 * Created by michelcarroll on 15-03-29.
 */

import Serializable = require('./Serializable');

class Repository<V extends Serializable> implements Serializable {

    private objects: { [id:number] : V };

    constructor() {
        this.objects = {};
    }

    public get(key:number) {
        return this.objects[key];
    }

    public serialize() {
        var self = this;
        return Object.getOwnPropertyNames(this.objects).map(
            function(key) { return self.objects[key].serialize(); }
        );
    }

    public delete(key:number) {
        delete this.objects[key];
    }

    public set(key:number, val:V) {
        this.objects[key] = val;
    }

    public getAll():V[] {
        var self = this;
        return Object.getOwnPropertyNames(this.objects).map(
            function(key) { return self.objects[key]; }
        );
    }

}

export = Repository;