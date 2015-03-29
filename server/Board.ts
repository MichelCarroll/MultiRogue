/**
 * Created by michelcarroll on 15-03-29.
 */


///<reference path='./ts-definitions/node.d.ts' />

var fs = require('fs');
eval(fs.readFileSync('./node_modules/rot.js/rot.js/rot.js','utf8'));

class Board {

    private width:number;
    private height:number;
    private tileMap:Object;
    private freeTiles:Array<string>;

    constructor(mapWidth:number, mapHeight:number) {
        this.width = mapWidth;
        this.height = mapHeight;
        this.tileMap = new Object();
        this.freeTiles =  new Array();
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

    public getRandomFreeTileKey() {
        var index = Math.floor(ROT.RNG.getUniform() * this.freeTiles.length);
        return this.freeTiles.splice(index, 1)[0];
    }

}


export = Board;