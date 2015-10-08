
import Serializable from './Serializable';


class Vector2D implements Serializable {
    public x:number;
    public y:number;

    constructor(x?:number, y?:number) {
        this.x = x;
        this.y = y;
    }

    public toString():string {
        return this.x + "," + this.y;
    }

    public add(x:number, y:number):Vector2D {
        return new Vector2D(this.x + x, this.y + y);
    }

    public length():number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    public unit():Vector2D {
        var length = this.length();
        if(length == 0) {
            return new Vector2D(0,0);
        }
        return new Vector2D(this.x / length, this.y / length);
    }

    public getDirectionVector():Vector2D {
        var unit = this.unit();
        if(unit.x > 0) {
            if(unit.y > 0.72) {
                return new Vector2D(0,1);
            } else if(unit.y > 0.33) {
                return new Vector2D(1,1);
            } else if(unit.y > -0.33) {
                return new Vector2D(1,0);
            } else if(unit.y > -0.72) {
                return new Vector2D(1,-1);
            } else {
                return new Vector2D(0,-1);
            }
        } else {
            if(unit.y > 0.72) {
                return new Vector2D(0,1);
            } else if(unit.y > 0.33) {
                return new Vector2D(-1,1);
            } else if(unit.y > -0.33) {
                return new Vector2D(-1,0);
            } else if(unit.y > -0.72) {
                return new Vector2D(-1,-1);
            } else {
                return new Vector2D(0,-1);
            }
        }
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

    public subVector(vector:Vector2D):Vector2D {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }

    public addVector(vector:Vector2D):Vector2D {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }

    public distanceFrom(vector:Vector2D):number {
        return this.subVector(vector).length();
    }

    public serialize():any {
        return {
            x: this.x,
            y: this.y
        }
    }

    public deserialize(data:any) {
        this.x = data.x;
        this.y = data.y;
    }
}

export = Vector2D;