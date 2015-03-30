/**
 * Created by michelcarroll on 15-03-27.
 */

/// <reference path="./Coordinate.ts" />

module Herbs {
    export class Board {

        private map;

        constructor() {
            this.map = new Object();
        }

        public getTile(position:Coordinate):any {
            return this.map[position.toString()];
        }

        public tileExists(position:Coordinate):boolean {
            return (this.map.hasOwnProperty(position.toString()));
        }

        public setTileMap(tileMap:any) {
            this.map = tileMap;
        }

        public setTile(position:Coordinate, val:any) {
            this.map[position.toString()] = val;
        }

        public deleteTile(position:Coordinate) {
            delete this.map[position.toString()];
        }
    }
}