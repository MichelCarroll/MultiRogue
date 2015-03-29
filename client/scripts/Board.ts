/**
 * Created by michelcarroll on 15-03-27.
 */


module Herbs {
    export class Board {

        private map;

        constructor() {
            this.map = new Object();
        }

        public getTile(x:number, y:number):any {
            return this.map[x+","+y];
        }

        public tileExists(x:number, y:number):boolean {
            return (this.map.hasOwnProperty(x+","+y));
        }

        public setTileMap(tileMap:any) {
            this.map = tileMap;
        }

        public setTile(x:number, y:number, val:any) {
            this.map[x+","+y] = val;
        }

        public deleteTile(x:number, y:number) {
            delete this.map[x+","+y];
        }
    }
}