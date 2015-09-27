/**
 * Created by michelcarroll on 15-03-29.
 */


import Vector2D = require('./Vector2D');

class Board {

    private size:Vector2D;
    private tileMap:Object;
    private tiles:Array<string>;

    constructor(tileMap:any, size:Vector2D) {
        this.size = size;
        this.tiles = [];
        this.tileMap = {};
        var self = this;
        Object.keys(tileMap).forEach(function(key) {
            self.addTileAtKey(key);
        });
    }

    public getTileMap() {
        return this.tileMap;
    }

    public addTile(position:Vector2D) {
        this.addTileAtKey(position.toString());
    }

    private addTileAtKey(key:string) {
        this.tiles.push(key);
        this.tileMap[key] = ".";
    }

    public getWidth():number {
        return this.size.x;
    }

    public getHeight():number {
        return this.size.y;
    }

    public getTileIndexLength():number {
        return this.tiles.length;
    }

    public getTileAtIndex(index:number):Vector2D {
        return Vector2D.fromString(this.tiles[index]);
    }

    public tileExists(position:Vector2D) {
        return (this.tiles.indexOf(position.toString()) > -1);
    }

    public getTile(position:Vector2D):any {
        if(this.tileMap[position.toString()]) {
            return '.';
        }
        return '';
    }
}


export = Board;