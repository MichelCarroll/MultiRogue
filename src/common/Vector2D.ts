

class Vector2D {
    public x:number;
    public y:number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    public toString():string {
        return this.x + "," + this.y;
    }

    public add(x:number, y:number):Vector2D {
        return new Vector2D(this.x + x, this.y + y);
    }

    public copy():Vector2D {
        return new Vector2D(this.x, this.y);
    }

    static add(a:Vector2D, b:Vector2D):Vector2D {
        return new Vector2D(a.x + b.x, a.y + b.y);
    }

    static fromString(str:string):Vector2D {
        var parts = str.split(",");
        return new Vector2D(parseInt(parts[0]), parseInt(parts[1]));
    }

    public equals(coord:Vector2D) {
        return this.x === coord.x && this.y === coord.y;
    }

    public addVector(vector:Vector2D):Vector2D {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    public distanceFrom(vector:Vector2D):number {
        return Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
    }
}

export = Vector2D;