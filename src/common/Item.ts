
import Vector2D = require('Vector2D');
import GameObject = require('./GameObject');

class Item extends GameObject {

    constructor(id:number) {
        super(id);
        this.setCanBePickedUp(true);
        this.setCanBeWalkedThrough(true);
    }

}

export = Item;