/**
 * Created by michelcarroll on 15-03-29.
 */

class Coordinate {
    public x:number;
    public y:number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    public toString():string {
        return this.x + "," + this.y;
    }

    static fromString(str:string):Coordinate {
        var parts = str.split(",");
        return new Coordinate(parseInt(parts[0]), parseInt(parts[1]));
    }

    public equals(coord:Coordinate) {
        return this.x === coord.x && this.y === coord.y;
    }
}

export = Coordinate;