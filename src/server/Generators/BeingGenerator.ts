

import Collidable = require('./../../common/Components/Collidable');
import Renderable = require('./../../common/Components/Renderable');
import Vector2D = require('./../../common/Vector2D');
import Container = require('./../../common/Components/Container');
import Playable = require('./../../common/Components/Playable');
import GameObject = require('./../../common/GameObject');

class BeingGenerator {

    static createPlayer(id:number, name:string):GameObject {
        var being = new GameObject();
        var renderable = new Renderable();
        renderable.setProperties({
            'token': '@',
            'frontColor': '#FF0',
            'backColor': ''
        });
        being.addComponent(renderable);
        being.addComponent(new Collidable());
        being.addComponent(new Container());
        being.addComponent(new Playable());
        being.setPosition(new Vector2D(0,0));
        being.setDescription('a player character');
        being.setName(name);
        being.setId(id);
        return being;
    }

}

export = BeingGenerator;