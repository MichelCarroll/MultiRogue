/**
 * Created by michelcarroll on 15-03-28.
 */

import Vector2D = require('./Vector2D');
import GameDisplayAdapter = require('./GameDisplayAdapter');

class UIAdapter {

    public clearMap:()=>void;
    public drawMap:()=>void;
    public setGameDisplayAdapter:(adapter:GameDisplayAdapter)=>void;
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