/**
 * Created by michelcarroll on 15-03-29.
 */

///<reference path='../../definitions/dynamicClassLoader.d.ts' />

import Serializer = require('./Serializer');
import Serializable = require('./Serializable');
import Vector2D = require('./Vector2D');
import Repository = require('./Repository');
import Component = require('./Components/Component');
import Playable = require('./Components/Playable');
import Content = require('./Components/Content');
import Container = require('./Components/Container');
import Collidable = require('./Components/Collidable');
import Renderable = require('./Components/Renderable');

class GameObject implements Serializable {

    protected position:Vector2D;
    protected id:number;
    protected name:string;
    protected description:string;
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

    //----------These should be dynamic-----------
    public isCollidable():boolean {
        return this.hasComponent('Collidable');
    }
    public isContent():boolean {
        return this.hasComponent('Content');
    }
    public isContainer():boolean {
        return this.hasComponent('Container');
    }
    public isPlayable():boolean {
        return this.hasComponent('Playable');
    }
    public isRenderable():boolean {
        return this.hasComponent('Renderable');
    }
    public getCollidableComponent():Collidable {
        return <Collidable>this.getComponent('Collidable');
    }
    public getContentComponent():Content {
        return <Content>this.getComponent('Content');
    }
    public getContainerComponent():Container {
        return <Container>this.getComponent('Container');
    }
    public getPlayableComponent():Playable {
        return <Playable>this.getComponent('Playable');
    }
    public getRenderableComponent():Renderable {
        return <Renderable>this.getComponent('Renderable');
    }
    //--------------------------------------------

    public setId(id:number) {
        this.id = id;
    }

    public setDescription(description:string) {
        this.description = description;
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

    public setName(name:string) {
        this.name = name;
    }

    public getName():string {
        return this.name;
    }

    public getDescription():string {
        return this.description;
    }

    public serialize() {
        return {
            'id': this.getId(),
            'x': this.position.x,
            'y': this.position.y,
            'name': this.getName(),
            'description': this.getDescription(),
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
        this.setName(data.name);
        this.setDescription(data.description);
        var self = this;
        data.components.forEach(function(componentData:any) {
            self.addComponent(<Component>Serializer.deserialize(componentData));
        });
    }
}

export = GameObject;