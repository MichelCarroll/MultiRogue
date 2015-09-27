/**
 * Created by michelcarroll on 15-03-29.
 */

///<reference path='../../definitions/dynamicClassLoader.d.ts' />

import Serializer = require('./Serializer');
import Serializable = require('./Serializable');
import Vector2D = require('./Vector2D');
import Repository = require('./Repository');
import Component = require('./Components/Component');

class GameObject implements Serializable {

    protected position:Vector2D;
    protected id:number;
    protected token:string;
    protected colorHex:string;
    protected name:string;
    protected description:string;
    protected canWalkOn:boolean = true;
    protected canPickUp:boolean = false;
    private components:Repository<Component>;

    constructor() {
        this.components = new Repository<Component>();
    }

    public addComponent(component:Component) {
        component.setTarget(this);
        this.components.set(component.getComponentKey(), component);
    }

    public hasComponent(type:string):boolean {
        return this.components.has(type);
    }

    public getComponent(type:string):Component {
        return this.components.get(type);
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

    public serialize() {
        return {
            'id': this.getId(),
            'x': this.position.x,
            'y': this.position.y,
            'color': this.getColor(),
            'token': this.getToken(),
            'canWalkOn': this.canBeWalkedThrough(),
            'name': this.getName(),
            'description': this.getDescription(),
            'canPickUp': this.canBePickedUp(),
            'inventory': {},
            'components': this.components.getAll().map(function(component:Component) {
                return Serializer.serialize(component);
            })
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
        this.setName(data.name);
        this.setDescription(data.description);
        this.setCanBeWalkedThrough(data.canWalkOn);
        this.setCanBePickedUp(data.canPickUp);
        var self = this;
        data.components.forEach(function(componentData:any) {
            self.addComponent(<Component>Serializer.deserialize(componentData));
        });
    }
}

export = GameObject;