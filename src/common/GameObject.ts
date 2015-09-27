/**
 * Created by michelcarroll on 15-03-29.
 */

///<reference path='../../definitions/dynamicClassLoader.d.ts' />

import Serializable = require('./Serializable');
import Vector2D = require('./Vector2D');

class GameObject implements Serializable {

    protected position:Vector2D;
    protected id:number;
    protected token:string;
    protected colorHex:string;
    protected name:string;
    protected description:string;
    protected isAPLayer:boolean = false;
    protected canWalkOn:boolean = true;
    protected canPickUp:boolean = false;

    constructor() {
    }

    public setId(id:number) {
        this.id = id;
    }

    public setColorHex(color:string) {
        this.colorHex = color;
    }

    public setDescription(description:string) {
        this.description = description;
    }

    public setToken(token:string) {
        this.token = token;
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

    public setName(name:string) {
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

    public setCanBeWalkedThrough(flag:boolean) {
        this.canWalkOn = flag;
    }

    public setCanBePickedUp(flag:boolean) {
        this.canPickUp = flag;
    }

    public canBeWalkedThrough():boolean {
        return this.canWalkOn;
    }

    public canBePickedUp():boolean {
        return this.canPickUp;
    }

    public setIsPlayer(isAPLayer:boolean) {
        this.isAPLayer = isAPLayer;
    }

    public isAPlayer():boolean {
        return this.isAPLayer;
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
            'isPlayer': this.isAPlayer(),
            'description': this.getDescription(),
            'canPickUp': this.canBePickedUp(),
            'inventory': {}
        };
    }

    static fromSerialization(data):GameObject {
        var go = new GameObject();
        go.deserialize(data);
        return go;
    }

    public deserialize(data:any) {
        this.setId(parseInt(data.id));
        this.setPosition(new Vector2D(parseInt(data.x), parseInt(data.y)));
        this.setToken(data.token);
        this.setColorHex(data.color);
        this.setIsPlayer(data['isPlayer']);
        this.setName(data.name);
        this.setDescription(data.description);
        this.setCanBeWalkedThrough(data.canWalkOn);
        this.setCanBePickedUp(data.canPickUp);
    }
}

export = GameObject;