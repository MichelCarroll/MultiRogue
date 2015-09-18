/**
 * Created by michelcarroll on 15-03-28.
 */


class UIAdapter {

    public setGameCanvas:(canvas:HTMLElement) => void;
    public clearGameDisplay:()=>void;
    public getBestFontSize:(mapWidth:number, mapHeight:number) => number;
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