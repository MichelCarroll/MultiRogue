

import Vector2D = require('../../common/Vector2D');

class GameDisplayAdapter {

    public mapSize:Vector2D;
    public getTileCallback:(position:Vector2D, r:number)=>{position:Vector2D; token:string; frontColor:string; backColor:string};
    public getCameraCallback:()=>{position:Vector2D; range:number};
    public getTileOpacityCallback:(position:Vector2D)=>boolean;

    constructor(mapSize, getCameraCallback, getTileCallback, getTileOpacityCallback) {
        this.mapSize = mapSize;
        this.getCameraCallback = getCameraCallback;
        this.getTileCallback = getTileCallback;
        this.getTileOpacityCallback = getTileOpacityCallback;
    }
}

export = GameDisplayAdapter;