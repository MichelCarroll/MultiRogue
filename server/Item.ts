
///<reference path='./ts-definitions/node.d.ts' />
///<reference path='./bower_components/rot.js-TS/rot.d.ts' />

var fs = require('fs');
eval(fs.readFileSync(__dirname+'/node_modules/rot.js/rot.js/rot.js','utf8'));

import Coordinate = require('./Coordinate');
import GameObject = require('./GameObject');

class Item extends GameObject {

    constructor(position:Coordinate, token:string, colorHex:string, name:string, description:string) {
        super(position, token, colorHex, name, description);
    }

    public serialize() {
        var data = super.serialize();
        data.canPickUp = true;
        return data;
    }
}

export = Item;