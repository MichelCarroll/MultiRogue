/**
 * Created by michelcarroll on 15-03-28.
 */

import Vector2D = require('./Vector2D');

class UIAdapter {

    public clearMap:()=>void;
    public drawMap:()=>void;
    public setMapSize:(size:Vector2D)=>void;
    public setTileCallback:(callback:(position:Vector2D, r:number)=>{position:Vector2D; token:string; frontColor:string; backColor:string})=>void;
    public setCameraCallback:(callback:()=>{position:Vector2D; range:number})=>void;
    public setTileOpacityCallback:(callback:(position:Vector2D)=>boolean)=>void;

    public clearPlayerList:() => void;
    public logOnUI:(message:string, logTag?:string) => void;
    public addPlayerToUI:(playerId:number, playerName:string) => void;
    public highlightPlayer:(playerId:number) => void;
    public removePlayerFromUI:(playerId:number) => void;
    public addItemToUI:(itemId:number, itemName:string) => void;
    public removeItemFromUI:(itemId:number) => void;
    public clickedItemFromUI:(itemId:number) => void;

}

export = UIAdapter;