
import Repository = require('./Repository');
import GameObject = require('./GameObject');
import Serializable = require('./Serializable');
import Serializer = require('./Serializer');

class Viewpoint implements Serializable {

    private gameObject:Repository<GameObject>;
    private player:GameObject;

    constructor() {
        this.gameObject = new Repository<GameObject>();
    }


    public addGameObject(go:GameObject) {
        this.gameObject.set(go.getId(), go);
    }

    public setPlayer(go:GameObject) {
        this.player = go;
    }

    public serialize():any {
        return {
            'gameObjects': this.gameObject.serialize(),
            'player': this.player.serialize()
        };
    }

    public deserialize(data:any) {

    }

}

export = Viewpoint;