
import Repository = require('./Repository');
import GameObject = require('./GameObject');
import GameObjectLayer = require('./GameObjectLayer');
import Serializable = require('./Serializable');
import Serializer = require('./Serializer');

class Viewpoint implements Serializable {

    public layer:GameObjectLayer;
    private player:GameObject;

    constructor() {
        this.layer = new GameObjectLayer();
        this.player = new GameObject();
    }


    public setLayer(layer:GameObjectLayer) {
        this.layer = layer;
    }

    public setPlayer(go:GameObject) {
        this.player = go;
    }

    public getPlayer():GameObject {
        return this.player;
    }

    public getLayer():GameObjectLayer {
        return this.layer;
    }

    public serialize():any {
        return {
            'layer': this.layer.serialize(),
            'player': this.player.serialize()
        };
    }

    public deserialize(data:any) {
        this.layer.deserialize(data.layer);
        this.player.deserialize(data.player);
    }

}

export = Viewpoint;