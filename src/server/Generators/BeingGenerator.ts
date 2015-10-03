

import Collidable = require('./../../common/Components/Collidable');
import Renderable = require('./../../common/Components/Renderable');
import Vector2D = require('./../../common/Vector2D');
import Container = require('./../../common/Components/Container');
import Playable = require('./../../common/Components/Playable');
import Allegiancable = require('./../../common/Components/Allegiancable');
import GameObject = require('./../../common/GameObject');

class BeingGenerator {

    public createRobot():GameObject {
        return this.createActor('Robot', '#888', 'robot');
    }

    public createPlayer():GameObject {
        return this.createActor('Player', '#FF0', 'player');
    }

    private createActor(name:string, colorHex:string, allegianceName:string):GameObject {
        var being = new GameObject();
        var renderable = new Renderable();
        renderable.setProperties({
            'token': '@',
            'frontColor': colorHex,
            'backColor': '',
            'layer': Renderable.BEING_LAYER
        });
        var allegiance = new Allegiancable();
        allegiance.setProperties({name: allegianceName});
        being.addComponent(renderable);
        being.addComponent(allegiance);
        being.addComponent(new Collidable());
        being.addComponent(new Container());
        being.addComponent(new Playable());
        being.setPosition(new Vector2D(0,0));
        being.setDescription('a player character');
        being.setName(name);
        return being;
    }

}

export = BeingGenerator;