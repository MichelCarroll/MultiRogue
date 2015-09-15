///<reference path='./../definitions/rot.d.ts' />

var fs = require('fs');

import Coordinate = require('./Coordinate');
import GameObject = require('./GameObject');
import Repository = require('./Repository');
import Item = require('./Item');
import ROT = require('./ROT');

class Being extends GameObject {

    private turns:number;
    private callForTurn:()=>void;
    private inventory:Repository<Item>;

    constructor(callForTurn:() => void) {
        super('@', "#FF0", '', 'a player character');
        this.setName('Player #' + this.getId());
        this.callForTurn = callForTurn;
        this.turns = 0;
        this.inventory = new Repository<Item>();
    }

    public addToInventory(go:GameObject) {
        this.inventory.set(go.getId(), go);
    }

    public removeFromInventory(go:GameObject) {
        this.inventory.delete(go.getId());
    }

    public getInventory():Repository<Item> {
        return this.inventory;
    }

    public askToTakeTurn() {
        this.callForTurn();
    }

    public giveTurns(turns:number) {
        this.turns += turns;
    }

    public canBeWalkedThrough() {
        return false;
    }

    public getRemainingTurns() {
        return this.turns;
    }

    public spendTurns(turns:number) {
        this.turns = Math.max(this.turns - turns, 0);
    }

    public serialize() {
        var data = super.serialize();
        data.isPlayer = true;
        data.inventory = this.inventory.serialize();
        return data;
    }
}

export = Being;