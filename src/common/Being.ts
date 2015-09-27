

import Renderable = require('./Components/Renderable');
import Collidable = require('./Components/Collidable');
import Repository = require('./Repository');
import Vector2D = require('./Vector2D');
import GameObject = require('./GameObject');

class Being extends GameObject {

    protected inventory:Repository<GameObject>;
    protected isAPLayer:boolean = false;
    protected actionTurns:number;

    constructor() {
        super();
        var renderable = new Renderable();
        renderable.setProperties({
            'token': '@',
            'frontColor': '#FF0',
            'backColor': ''
        });
        this.addComponent(renderable);
        this.addComponent(new Collidable());
        this.setPosition(new Vector2D(0,0));
        this.setDescription('a player character');
        this.actionTurns = 0;
        this.isAPLayer = true;
        this.inventory = new Repository<GameObject>();
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

    public addToInventory(go:GameObject) {
        if(!go.hasComponent('Holdable')) {
            throw new Error('Can\'t hold this item');
        }
        this.inventory.set(go.getId(), go);
    }

    public removeFromInventory(go:GameObject) {
        this.inventory.delete(go.getId());
    }

    public getInventory():Repository<GameObject> {
        return this.inventory;
    }

    public setIsPlayer(isAPLayer:boolean) {
        this.isAPLayer = isAPLayer;
    }

    public isAPlayer():boolean {
        return this.isAPLayer;
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