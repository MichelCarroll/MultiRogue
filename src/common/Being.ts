

import Item = require('./Item');
import Repository = require('./Repository');
import Vector2D = require('./Vector2D');
import GameObject = require('./GameObject');

class Being extends GameObject {

    private inventory:Repository<Item>;
    private actionTurns:number;

    constructor() {
        super();
        this.setPosition(new Vector2D(0,0));
        this.setToken('@');
        this.setColorHex('#FF0');
        this.setDescription('a player character');
        this.setCanBeWalkedThrough(false);
        this.setCanBePickedUp(false);
        this.actionTurns = 0;
        this.isAPLayer = true;
        this.inventory = new Repository<Item>();
    }

    public getName():string {
        return 'Player #' + this.getId();
    }

    public giveTurns(turns:number) {
        this.actionTurns += turns;
    }

    public spendTurns(turns:number) {
        this.actionTurns = Math.max(this.actionTurns - turns, 0);
    }

    public getRemainingTurns() {
        return this.actionTurns;
    }

    public addToInventory(go:Item) {
        this.inventory.set(go.getId(), go);
    }

    public removeFromInventory(go:Item) {
        this.inventory.delete(go.getId());
    }

    public getInventory():Repository<Item> {
        return this.inventory;
    }

    public serialize() {
        var data:any = super.serialize();
        data.isPlayer = true;
        data.inventory = this.inventory.serialize();
        data.turns = this.actionTurns;
        return data;
    }

    public deserialize(data:any) {
        super.deserialize(data);
        this.isAPLayer = true;
        this.actionTurns = data.turns;
        this.inventory.deserialize(data.inventory);
    }
}

export = Being;