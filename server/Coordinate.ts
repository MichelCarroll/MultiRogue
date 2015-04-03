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

    public copy():Coordinate {
        return new Coordinate(this.x, this.y);
    }

    static add(a:Coordinate, b:Coordinate):Coordinate {
        return new Coordinate(a.x + b.x, a.y + b.y);
    }

    public add(x:number, y:number):Coordinate {
        return new Coordinate(this.x + x, this.y + y);
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