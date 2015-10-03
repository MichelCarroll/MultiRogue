
import Map = require('./Map')
import Serializable = require('./Serializable');
import GameObject = require('./GameObject');

class Repository {

    private nextId:number = 1;
    private map:Map<GameObject>;

    constructor() {
        this.map = new Map<GameObject>();
    }

    public insert(go:GameObject) {
        if(!go.getId()) {
            var id = this.nextId++;
            go.setId(id);
            this.map.set(id, go);
        } else {
            this.map.set(go.getId(), go);
        }
    }

    public get(goId:number):GameObject {
        return this.map.get(goId);
    }

    public delete(goId:number) {
        this.map.delete(goId);
    }

}

export = Repository;