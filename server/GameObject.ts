/**
 * Created by michelcarroll on 15-03-29.
 */

///<reference path='./ts-definitions/node.d.ts' />
///<reference path='./bower_components/rot.js-TS/rot.d.ts' />

var fs = require('fs');
eval(fs.readFileSync(__dirname+'/node_modules/rot.js/rot.js/rot.js','utf8'));

import Coordinate = require('./Coordinate');

class GameObject {

    protected position:Coordinate;
    protected id:number;
    protected token:string;
    protected colorHex:string;
    protected name:string;
    protected description:string;

    static lastId = 1;

    static getNextId() {
        return this.lastId++;
    }

    constructor(position:Coordinate, token:string, color:string, name:string, description:string) {
        this.position = position;
        this.id = GameObject.getNextId();
        this.token = token;
        this.colorHex = color;
        this.name = name;
        this.description = description;
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

    protected setName(name:string) {
        this.name = name;
    }

    public getName():string {
        return this.name;
    }

    public getDescription():string {
        return this.description;
    }

    public getColor():string {
        return this.colorHex;
    }

    public canBeWalkedThrough():boolean {
        return true;
    }

    public canBePickedUp():boolean {
        return false;
    }

    public serialize() {
        return {
            'id': this.getId(),
            'x': this.position.x,
            'y': this.position.y,
            'color': this.getColor(),
            'token': this.getToken(),
            'canWalkOn': this.canBeWalkedThrough(),
            'name': this.getName(),
            'isPlayer': false,
            'description': this.getDescription(),
            'canPickUp': this.canBePickedUp(),
            'inventory': {}
        };
    }
}

export = GameObject;