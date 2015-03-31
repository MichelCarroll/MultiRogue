/**
 * Created by michelcarroll on 15-03-29.
 */

///<reference path='./bower_components/rot.js-TS/rot.d.ts' />

var fs = require('fs');
eval(fs.readFileSync('./node_modules/rot.js/rot.js/rot.js','utf8'));

import Coordinate = require('./Coordinate');

class GameObject {

    protected position:Coordinate;
    protected id:number;
    protected token:string;
    protected colorHex:string;

    static lastId = 1;

    static getNextId() {
        return this.lastId++;
    }

    constructor(position:Coordinate, token:string, color:string) {
        this.position = position;
        this.id = GameObject.getNextId();
        this.token = token;
        this.colorHex = color;
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
        return this.token;
    }

    public getColor():string {
        return this.colorHex;
    }

    public canBeWalkedThrough() {
        return true;
    }

    public serialize() {
        return {
            'id': this.getId(),
            'x': this.position.x,
            'y': this.position.y,
            'color': this.getColor(),
            'token': this.getToken(),
            'canWalkOn': this.canBeWalkedThrough(),
            'name': 'Player #' + this.getId(),
            'is-player': false
        };
    }
}

export = GameObject;