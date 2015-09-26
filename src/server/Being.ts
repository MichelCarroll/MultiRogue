///<reference path='../../definitions/rot.d.ts' />

var fs = require('fs');

import Vector2D = require('../common/Vector2D');
import GameObject = require('./../common/GameObject');
import Repository = require('./../common/Repository');
import Item = require('./../common/Item');
import ROT = require('./ROT');

class Being extends GameObject {

    private inventory:Repository<Item>;

    constructor(id:number) {
        super(id);
        this.setPosition(new Vector2D(0,0));
        this.setToken('@');
        this.setColorHex('#FF0');
        this.setDescription('a player character');
        this.setName('Player #' + this.getId());
        this.setCanBeWalkedThrough(false);
        this.setCanBePickedUp(false);
        this.isAPLayer = true;
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

    public serialize() {
        var data = super.serialize();
        data.isPlayer = true;
        data.inventory = this.inventory.serialize();
        return data;
    }
}

export = Being;