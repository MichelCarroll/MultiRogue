/**
 * Created by michelcarroll on 15-03-29.
 */


///<reference path='../../definitions/vendor/node.d.ts' />

var fs = require('fs');

import ROT = require('./ROT');
import Vector2D = require('../common/Vector2D');

class Board {

    private size:Vector2D;
    private tileMap:Object;
    private tiles:Array<string>;

    constructor(size:Vector2D) {
        this.size = size;
        this.tileMap = new Object();
        this.tiles = new Array();
    }

    public getTileMap() {
        return this.tileMap;
    }

    public addTile(position:Vector2D) {
        this.tiles.push(position.toString());
        this.tileMap[position.toString()] = ".";
    }

    public getWidth():number {
        return this.size.x;
    }

    public getHeight():number {
        return this.size.y;
    }

    public getRandomTile():Vector2D {
        var index = Math.floor(ROT.RNG.getUniform() * this.tiles.length);
        return Vector2D.fromString(this.tiles[index]);
    }

    public tileExists(position:Vector2D) {
        return (this.tiles.indexOf(position.toString()) > -1);
    }

}


export = Board;