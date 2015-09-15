
var fs = require('fs');

import Coordinate = require('./Coordinate');
import GameObject = require('./GameObject');
import ROT = require('./ROT');

class Item extends GameObject {

    public canBePickedUp():boolean {
        return true;
    }
}

export = Item;