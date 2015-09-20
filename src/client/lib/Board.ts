/**
 * Created by michelcarroll on 15-03-27.
 */

import Coordinate = require('./Vector2D');

class Board {

    private map;
    private width;
    private height;

    constructor(tileMap:any, width:number, height:number) {
        this.map = tileMap;
        this.width = width;
        this.height = height;
    }

    public getWidth():number {
        return this.width;
    }

    public getHeight():number {
        return this.height;
    }

    public getTile(position:Coordinate):any {
        return this.map[position.toString()];
    }

    public tileExists(position:Coordinate):boolean {
        return (this.map.hasOwnProperty(position.toString()));
    }
}

export = Board;