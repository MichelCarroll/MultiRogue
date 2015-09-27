
import Walkable = require('./../../common/Components/Walkable');
import Renderable = require('./../../common/Components/Renderable');
import GameObject = require('./../../common/GameObject');
import Vector2D = require('../../common/Vector2D');

class FloorGenerator {

    static create(position:Vector2D):GameObject {
        var floor = new GameObject();
        var renderable = new Renderable();
        renderable.setProperties({
            'token': '.',
            'frontColor': '#fff',
            'backColor': '',
            'layer': Renderable.FLOOR_LAYER
        });
        floor.addComponent(renderable);
        floor.addComponent(new Walkable());
        floor.setPosition(position);
        return floor;
    }

}

export = FloorGenerator;