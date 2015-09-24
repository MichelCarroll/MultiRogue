///<reference path='../../definitions/rot.d.ts' />

var fs = require('fs');

import Vector2D = require('../common/Vector2D');
import GameObject = require('./GameObject');
import Repository = require('./Repository');
import Item = require('./Item');
import ROT = require('./ROT');

class Being extends GameObject {

    private inventory:Repository<Item>;

    constructor(id:number) {
        super(id, '@', "#FF0", '', 'a player character');
        this.setName('Player #' + this.getId());
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

    public canBeWalkedThrough() {
        return false;
    }

    public serialize() {
        var data = super.serialize();
        data.isPlayer = true;
        data.inventory = this.inventory.serialize();
        return data;
    }
}

export = Being;