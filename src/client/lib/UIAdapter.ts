/**
 * Created by michelcarroll on 15-03-28.
 */

import Vector2D = require('../../common/Vector2D');
import GameDisplayAdapter = require('./GameDisplayAdapter');

interface UIAdapter {

    clearMap:()=>void;
    drawMap:()=>void;
    setGameDisplayAdapter:(adapter:GameDisplayAdapter)=>void;
    clearPlayerList:() => void;
    logOnUI:(message:string, logTag?:string) => void;
    addPlayerToUI:(playerId:number, playerName:string) => void;
    highlightPlayer:(playerId:number) => void;
    removePlayerFromUI:(playerId:number) => void;
    addItemToUI:(itemId:number, itemName:string) => void;
    removeItemFromUI:(itemId:number) => void;
    clickedItemFromUI:(itemId:number) => void;

}

export = UIAdapter;