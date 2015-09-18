/**
 * Created by michelcarroll on 15-03-29.
 */


///<reference path='./../../definitions/vendor/node.d.ts' />

var fs = require('fs');

import ROT = require('./ROT');
import Coordinate = require('./Coordinate');

class Board {

    private size:Coordinate;
    private tileMap:Object;
    private tiles:Array<string>;

    constructor(size:Coordinate) {
        this.size = size;
        this.tileMap = new Object();
        this.tiles = new Array();
    }

    public getTileMap() {
        return this.tileMap;
    }

    public addTile(position:Coordinate) {
        this.tiles.push(position.toString());
        this.tileMap[position.toString()] = ".";
    }

    public getWidth():number {
        return this.size.x;
    }

    public getHeight():number {
        return this.size.y;
    }

    public getRandomTile():Coordinate {
        var index = Math.floor(ROT.RNG.getUniform() * this.tiles.length);
        return Coordinate.fromString(this.tiles[index]);
    }

    public tileExists(position:Coordinate) {
        return (this.tiles.indexOf(position.toString()) > -1);
    }

}


export = Board;