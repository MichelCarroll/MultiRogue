
///<reference path='./bower_components/rot.js-TS/rot.d.ts' />

var fs = require('fs');
eval(fs.readFileSync(__dirname+'/node_modules/rot.js/rot.js/rot.js','utf8'));

import Coordinate = require('./Coordinate');
import GameObject = require('./GameObject');

class Being extends GameObject {

    private turns:number;
    private callForTurn:()=>void;
    private inventory:{ [id:number] : GameObject };

    constructor(position:Coordinate, callForTurn:() => void) {
        super(position, '@', "#FF0", '', 'a player character');
        this.setName('Player #' + this.getId());
        this.callForTurn = callForTurn;
        this.turns = 0;
        this.inventory = {};
    }

    public addToInventory(go:GameObject) {
        this.inventory[go.getId()] = go;
    }

    public removeFromInventory(go:GameObject) {
        delete this.inventory[go.getId()];
    }

    public getSerializedInventory():Array<GameObject> {
        var self = this;
        return Object.getOwnPropertyNames(this.inventory).map(
            function(key) { return self.inventory[key].serialize(); }
        );
    }

    public getInventory():{ [id:number] : GameObject } {
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
        data.inventory = this.getSerializedInventory();
        return data;
    }
}

export = Being;