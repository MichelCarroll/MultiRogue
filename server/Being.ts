
///<reference path='./bower_components/rot.js-TS/rot.d.ts' />

var fs = require('fs');
eval(fs.readFileSync('./node_modules/rot.js/rot.js/rot.js','utf8'));

import Coordinate = require('./Coordinate');
import GameObject = require('./GameObject');

class Being extends GameObject {

    private turns:number;
    private callForTurn:()=>void;

    constructor(position:Coordinate, callForTurn:() => void) {
        super(position, '@', "#FF0", '', 'a player character');
        this.setName('Player #' + this.getId());
        this.callForTurn = callForTurn;
        this.turns = 0;
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
        data['is-player'] = true;
        return data;
    }
}

export = Being;