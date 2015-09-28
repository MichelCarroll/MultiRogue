
import Repository = require('./../common/Repository');
import GameObject = require('./../common/GameObject');
import GameObjectLayer = require('./../common/GameObjectLayer');
import Serializable = require('./../common/Serializable');
import Serializer = require('./../common/Serializer');

class Viewpoint implements Serializable {

    public layer:GameObjectLayer;
    private player:GameObject;

    constructor() {
        this.layer = new GameObjectLayer();
    }


    public setLayer(layer:GameObjectLayer) {
        this.layer = layer;
    }

    public setPlayer(go:GameObject) {
        this.player = go;
    }

    public serialize():any {
        return {
            'layer': this.layer.serialize(),
            'player': this.player.serialize()
        };
    }

    public deserialize(data:any) {
        //not meant to be deserialized
    }

}

export = Viewpoint;