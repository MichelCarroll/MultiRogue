/**
 * Created by michelcarroll on 15-03-29.
 */


///<reference path='./ts-definitions/node.d.ts' />

var difference = require('array-difference');
var fs = require('fs');
eval(fs.readFileSync('./node_modules/rot.js/rot.js/rot.js','utf8'));

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

    public addTile(x:number, y:number) {
        var key = x+","+y;
        this.freeTiles.push(key);
        this.tileMap[key] = ".";
    }

    public getWidth() {
        return this.width;
    }

    public getHeight() {
        return this.height;
    }

    public getRandomUnoccupiedTile() {
        var unoccupiedTiles = difference(this.freeTiles, this.occupiedTiles);
        if(!unoccupiedTiles.length) {
            return;
        }

        var index = Math.floor(ROT.RNG.getUniform() * unoccupiedTiles.length);
        return unoccupiedTiles.splice(index, 1)[0];
    }

    public occupyTile(x:number, y:number) {
        this.occupiedTiles.push(x+","+y);
    }

    public unoccupyTile(x:number, y:number) {
        var index = this.occupiedTiles.indexOf(x+","+y);
        if(index > -1) {
            this.occupiedTiles.splice(index, 1);
        }
    }

    public isTileOccupied(x:number, y:number) {
        return (this.occupiedTiles.indexOf(x+","+y) > -1);
    }

}


export = Board;