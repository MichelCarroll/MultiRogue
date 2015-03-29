
///<reference path='./bower_components/rot.js-TS/rot.d.ts' />

import Coordinate = require('./Coordinate');

class Being {

    private position:Coordinate;
    private id:number;
    private turns:number;
    private callForTurn:()=>void;

    static lastId = 1;

    static getNextId() {
        return this.lastId++;
    }

    constructor(position:Coordinate, callForTurn:() => void) {
        this.position = position;
        this.callForTurn = callForTurn;
        this.id = Being.getNextId();
        this.turns = 0;
    }

    public getId():number {
        return this.id;
    }

    public getPosition():Coordinate {
        return this.position;
    }

    public setPosition(position:Coordinate) {
        this.position = position;
    }

    public getToken():string {
        return '@';
    }

    public getColor():string {
        return '#888';
    }

    public askToTakeTurn() {
        this.callForTurn();
    }

    public giveTurns(turns:number) {
        this.turns += turns;
    }

    public getRemainingTurns() {
        return this.turns;
    }

    public spendTurns(turns:number) {
        this.turns = Math.max(this.turns - turns, 0);
    }

    public serialize() {
        return {
            'id': this.getId(),
            'x': this.position.x,
            'y': this.position.y,
            'color': this.getColor(),
            'token': this.getToken()
        };
    }
}

export = Being;