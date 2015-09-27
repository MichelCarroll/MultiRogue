
import GameObject = require('./GameObject');

class Item extends GameObject {

    constructor() {
        super();
        this.setCanBePickedUp(true);
    }

}

export = Item;