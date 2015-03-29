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
    private freeTiles:Array<string>;
    private occupiedTiles:Array<string>;

    constructor(mapWidth:number, mapHeight:number) {
        this.width = mapWidth;
        this.height = mapHeight;
        this.tileMap = new Object();
        this.freeTiles = new Array();
        this.occupiedTiles = new Array();
    }

    public getTileMap() {
        return this.tileMap;
    }

    public addTile(position:Coordinate) {
        this.freeTiles.push(position.toString());
        this.tileMap[position.toString()] = ".";
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public getRandomUnoccupiedTile():Coordinate {
        var unoccupiedTiles = difference(this.freeTiles, this.occupiedTiles);
        if(!unoccupiedTiles.length) {
            return;
        }

        var index = Math.floor(ROT.RNG.getUniform() * unoccupiedTiles.length);
        return Coordinate.fromString(unoccupiedTiles.splice(index, 1)[0]);
    }

    public occupyTile(position:Coordinate) {
        this.occupiedTiles.push(position.toString());
    }

    public unoccupyTile(position:Coordinate) {
        var index = this.occupiedTiles.indexOf(position.toString());
        if(index > -1) {
            this.occupiedTiles.splice(index, 1);
        }
    }

    public isTileOccupied(position:Coordinate) {
        return (this.occupiedTiles.indexOf(position.toString()) > -1);
    }

}


export = Board;