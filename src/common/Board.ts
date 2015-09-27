/**
 * Created by michelcarroll on 15-03-29.
 */


import Vector2D = require('./Vector2D');
import GameObject = require('./GameObject');
import Repository = require('./Repository');
import Serializable = require('./Serializable');

class Board implements Serializable {

    private size:Vector2D;
    private tiles:Repository<GameObject>;
    private tilesIndex:Array<string>;

    constructor() {
        this.tilesIndex = [];
        this.tiles = new Repository<GameObject>();
    }

    public setSize(size:Vector2D) {
        this.size = size;
    }

    public getTileMap() {
        return this.tiles;
    }

    public addTile(floor:GameObject) {
        var key = floor.getPosition().toString();
        this.tiles.set(key, floor);
        this.tilesIndex.push(key);
    }

    public getWidth():number {
        return this.size.x;
    }

    public getHeight():number {
        return this.size.y;
    }

    public getTileIndexLength():number {
        return this.tilesIndex.length;
    }

    public getTileAtIndex(index:number):Vector2D {
        return Vector2D.fromString(this.tilesIndex[index]);
    }

    public tileExists(position:Vector2D) {
        return this.tiles.has(position.toString());
    }

    public getTile(position:Vector2D):any {
        return this.tiles.get(position.toString());
    }

    public deserialize(data:any) {
        this.size = Vector2D.fromString(data.size);
        this.tiles.deserialize(data.tiles);
        this.tilesIndex = data.tilesIndex;
    }

    public serialize():any {
        return {
            size: this.size.toString(),
            tiles: this.tiles.serialize(),
            tilesIndex: this.tilesIndex
        }
    }
}


export = Board;