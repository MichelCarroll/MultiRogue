
import Content = require('./../../common/Components/Content');
import Renderable = require('./../../common/Components/Renderable');
import GameObject = require('./../../common/GameObject');
import Vector2D = require('../../common/Vector2D');


class ItemGenerator {

    static createRandomSticks(colorHex:string, position:Vector2D):GameObject {
        var item = new GameObject();
        var renderable = new Renderable();
        renderable.setProperties({
            'token': '/',
            'frontColor': colorHex,
            'backColor': '',
            'layer': Renderable.ITEM_LAYER
        });
        item.addComponent(renderable);
        item.addComponent(new Content());
        item.setName('Wooden Stick');
        item.setDescription('a simple piece of wood');
        item.setPosition(position);
        return item;
    }

}

export = ItemGenerator;