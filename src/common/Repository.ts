/**
 * Created by michelcarroll on 15-03-29.
 */

import Serializer = require('./Serializer');
import Serializable = require('./Serializable');

class Repository<V extends Serializable> implements Serializable {

    private objects:any;

    constructor() {
        this.objects = {};
    }

    public get(key:any) {
        return this.objects[key];
    }

    public has(key:any) {
        return !!this.objects[key];
    }

    public serialize() {
        var self = this;
        return Object.getOwnPropertyNames(this.objects).map(
            function(key) { return {
                key: key,
                data: Serializer.serialize(self.objects[key])
            }; }
        );
    }

    public deserialize(data:any) {
        var self = this;
        data.forEach(function(serializedGO) {
            self.objects[serializedGO.key] = (<V>Serializer.deserialize(serializedGO.data));
        });
    }

    public delete(key:any) {
        delete this.objects[key];
    }

    public set(key:any, val:V) {
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