
import Repository = require('./Repository');
import GameObject = require('./GameObject');
import GameObjectLayer = require('./GameObjectLayer');
import Serializable = require('./Serializable');
import Serializer = require('./Serializer');

class Viewpoint implements Serializable {

    public layer:GameObjectLayer;
    private actor:GameObject;

    constructor() {
        this.layer = new GameObjectLayer();
        this.actor = new GameObject();
    }


    public setLayer(layer:GameObjectLayer) {
        this.layer = layer;
    }

    public setActor(go:GameObject) {
        this.actor = go;
    }

    public getActor():GameObject {
        return this.actor;
    }

    public getLayer():GameObjectLayer {
        return this.layer;
    }

    public serialize():any {
        return {
            'layer': this.layer.serialize(),
            'player': this.actor.serialize()
        };
    }

    public deserialize(data:any) {
        this.layer.deserialize(data.layer);
        this.actor.deserialize(data.player);
    }

}

export = Viewpoint;