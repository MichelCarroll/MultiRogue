/**
 * Created by michelcarroll on 15-03-29.
 */


///<reference path='./ts-definitions/node.d.ts' />

var difference = require('array-difference');
var fs = require('fs');
eval(fs.readFileSync('./node_modules/rot.js/rot.js/rot.js','utf8'));

import Coordinate = require('./Coordinate');

class Board {

    private width:number;
    private height:number;
    private tileMap:Object;
    private tiles:Array<string>;

    constructor(mapWidth:number, mapHeight:number) {
        this.width = mapWidth;
        this.height = mapHeight;
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

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
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