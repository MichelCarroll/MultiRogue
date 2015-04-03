/**
 * Created by michelcarroll on 15-03-29.
 */

module Herbs {
    export class Coordinate {
        public x:number;
        public y:number;

        constructor(x:number, y:number) {
            this.x = x;
            this.y = y;
        }

        public add(x:number, y:number):Coordinate {
            return new Coordinate(this.x + x, this.y + y);
        }

        public toString():string {
            return this.x + "," + this.y;
        }

        public copy():Coordinate {
            return new Coordinate(this.x, this.y);
        }
    }
}