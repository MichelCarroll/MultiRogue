/**
 * Created by michelcarroll on 15-03-29.
 */

///<reference path='../../definitions/vendor/node.d.ts' />
///<reference path='../../definitions/rot.d.ts' />

var fs = require('fs');

import Serializable = require('./Serializable');
import Vector2D = require('../common/Vector2D');
import ROT = require('./ROT');

class GameObject implements Serializable {

    protected position:Vector2D;
    protected id:number;
    protected token:string;
    protected colorHex:string;
    protected name:string;
    protected description:string;

    constructor(id:number, token:string, color:string, name:string, description:string) {
        this.id = id;
        this.position = new Vector2D(0,0);
        this.token = token;
        this.colorHex = color;
        this.name = name;
        this.description = description;
    }

    public getId():number {
        return this.id;
    }

    public getPosition():Vector2D {
        return this.position;
    }

    public setPosition(position:Vector2D) {
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