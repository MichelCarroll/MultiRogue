/**
 * Created by michelcarroll on 15-03-29.
 */

///<reference path='../../definitions/dynamicClassLoader.d.ts' />

import Serializer = require('./Serializer');
import Serializable from './Serializable';
import Vector2D = require('./Vector2D');
import Map = require('./Map');
import Component = require('./Component');
import Playable = require('./Components/Playable');
import Content = require('./Components/Content');
import Container = require('./Components/Container');
import Collidable = require('./Components/Collidable');
import Renderable = require('./Components/Renderable');
import Health = require('./Components/Health');
import Walkable = require('./Components/Walkable');
import Allegiancable = require('./Components/Allegiancable');
import Referenceable from './Referenceable';

class GameObject implements Serializable, Referenceable {

    protected position:Vector2D;
    protected id:number;
    protected name:string = '';
    protected description:string = '';
    private notificationListener;
    private components:Map<Component>;

    constructor() {
        this.components = new Map<Component>();
    }

    public setNotificationListener(callback:(msg:string)=>void) {
        this.notificationListener = callback;
    }

    public notify(message:string) {
        if(this.notificationListener) {
            this.notificationListener(message);
        }
    }

    public addComponent(component:Component) {
        component.setTarget(this);
        this.components.set(component.getComponentKey(), component);
    }

    public hasComponent(type:string):boolean {
        return this.components.has(type);
    }

    private getComponent(type:string):Component {
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
    public isHealthed():boolean {
        return this.hasComponent('Health');
    }
    public isRenderable():boolean {
        return this.hasComponent('Renderable');
    }
    public isWalkable():boolean {
        return this.hasComponent('Walkable');
    }
    public isAllegiancable():boolean {
        return this.hasComponent('Allegiancable');
    }
    public getAllegiancableComponent():Allegiancable {
        return <Allegiancable>this.getComponent('Allegiancable');
    }
    public getCollidableComponent():Collidable {
        return <Collidable>this.getComponent('Collidable');
    }
    public getContentComponent():Content {
        return <Content>this.getComponent('Content');
    }
    public getHealthComponent():Health {
        return <Health>this.getComponent('Health');
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
    public getWalkableComponent():Walkable {
        return <Renderable>this.getComponent('Walkable');
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