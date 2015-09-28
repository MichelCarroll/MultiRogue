

import Vector2D = require('../../common/Vector2D');

class GameDisplayAdapter {

    public mapSize:Vector2D;
    public getTileCallback:(position:Vector2D)=>{position:Vector2D; token:string; frontColor:string; backColor:string};

    constructor(mapSize, getTileCallback) {
        this.mapSize = mapSize;
        this.getTileCallback = getTileCallback;
    }
}

export = GameDisplayAdapter;