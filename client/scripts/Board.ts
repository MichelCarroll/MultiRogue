/**
 * Created by michelcarroll on 15-03-27.
 */

/// <reference path="./Coordinate.ts" />

module Herbs {
    export class Board {

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

        public getTile(position:Coordinate):any {
            return this.map[position.toString()];
        }

        public tileExists(position:Coordinate):boolean {
            return (this.map.hasOwnProperty(position.toString()));
        }

        public setTile(position:Coordinate, val:any) {
            this.map[position.toString()] = val;
        }

        public deleteTile(position:Coordinate) {
            delete this.map[position.toString()];
        }
    }
}