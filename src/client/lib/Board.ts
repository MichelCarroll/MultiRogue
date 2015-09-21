/**
 * Created by michelcarroll on 15-03-27.
 */

import Vector2D = require('../../common/Vector2D');

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

    public getTile(position:Vector2D):any {
        return this.map[position.toString()];
    }

    public tileExists(position:Vector2D):boolean {
        return (this.map.hasOwnProperty(position.toString()));
    }
}

export = Board;