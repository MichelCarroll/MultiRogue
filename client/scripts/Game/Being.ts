/**
 * Created by michelcarroll on 15-03-22.
 */

/// <reference path="../../bower_components/rot.js-TS/rot.d.ts"/>

class Being {

    private x:number;
    private y:number;
    private id:number;

    constructor(id:number, x:number, y:number) {
        this.x = x;
        this.y = y;
        this.id = id;
    }

    public getId():number {
        return this.id;
    }

    public getX():number {
        return this.x;
    }

    public getY():number {
        return this.y;
    }

    public setX(x:number) {
        this.x = x;
    }

    public setY(y:number) {
        this.y = y;
    }

    public getToken():string {
        return '@';
    }

    public getColor():string {
        return '#FF0';
    }

    static fromSerialization(data) {
        return new Being(
            parseInt(data.id),
            parseInt(data.x),
            parseInt(data.y)
        );
    }
}