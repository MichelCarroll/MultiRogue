/**
 * Created by michelcarroll on 15-03-28.
 */


module Herbs {
    export class UIAdapter {

        public setGameCanvas:(canvas:HTMLElement) => void;
        public clearGameDisplay:()=>void;
        public getBestFontSize:(mapWidth:number, mapHeight:number) => number;
        public clearPlayerList:() => void;
        public logOnUI:(message:string, logTag?:string) => void;
        public addPlayerToUI:(playerId:number) => void;
        public highlightPlayer:(playerId:number) => void;
        public removePlayerFromUI:(playerId:number) => void;

    }
}