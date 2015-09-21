
var fs = require('fs');

import Vector2D = require('../common/Vector2D');
import GameObject = require('./GameObject');
import ROT = require('./ROT');

class Item extends GameObject {

    public canBePickedUp():boolean {
        return true;
    }
}

export = Item;