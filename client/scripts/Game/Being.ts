/**
 * Created by michelcarroll on 15-03-22.
 */

/// <reference path="../../bower_components/rot.js-TS/rot.d.ts"/>


class Being implements ROT.IActor {

    private x:number;
    private y:number;
    private id:number;
    private handleAct:(being:Being) => void;

    constructor(id:number, x:number, y:number, handleAct:(being:Being) => void) {
        this.x = x;
        this.y = y;
        this.handleAct = handleAct;
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
        return '#888';
    }

    public act() {
        this.handleAct(this);
    }
}