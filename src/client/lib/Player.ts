/**
 * Created by michelcarroll on 15-03-22.
 */

import GameObject = require('../../common/GameObject');
import Repository = require('../../common/Repository');

class Player extends GameObject {

    private actionTurns;
    private inventory:Repository<GameObject>;

    constructor(id:number) {
        super(id);
        this.actionTurns = 0;
        this.inventory = new Repository<GameObject>();
    }

    public addToInventory(go:GameObject) {
        this.inventory.set(go.getId(), go);
    }

    public removeFromInventory(go:GameObject) {
        this.inventory.delete(go.getId());
    }

    public getInventory():Repository<GameObject> {
        return this.inventory;
    }

    public getRemainingActionTurns():number {
        return this.actionTurns;
    }

    public giveTurns(turns:number) {
        this.actionTurns += turns;
    }

    public useTurns(turns:number) {
        this.actionTurns = Math.max(this.actionTurns - turns, 0);
    }

    static fromSerialization(data):Player {
        var player = new Player(parseInt(data.id));
        GameObject.assignSerializedData(player, data);
        return player;
    }
}

export = Player;