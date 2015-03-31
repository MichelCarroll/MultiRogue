/**
 * Created by michelcarroll on 15-03-22.
 */

/// <reference path="./Coordinate.ts" />

module Herbs {
    export class GameObject {

        protected position:Coordinate;
        protected id:number;
        protected token:string;
        protected colorHex:string;
        protected canWalkOn:boolean;
        protected name:string;
        protected isAPLayer:boolean;
        protected description:string;

        constructor(id:number) {
            this.id = id;
        }

        public setToken(token:string) {
            this.token = token;
        }

        public setColorHex(colorHex:string) {
            this.colorHex = colorHex;
        }

        public setPosition(position:Coordinate) {
            this.position = position;
        }

        public setDescription(description:string) {
            this.description = description;
        }

        public getDescription():string {
            return this.description;
        }

        public getId():number {
            return this.id;
        }

        public getPosition() {
            return this.position;
        }

        public getToken():string {
            return this.token;
        }

        public getColor():string {
            return this.colorHex;
        }

        public setCanBeWalkedThrough(value:boolean) {
            this.canWalkOn = value;
        }

        public canBeWalkedThrough():boolean {
            return this.canWalkOn;
        }

        public setName(name:string) {
            this.name = name;
        }

        public getName():string {
            return this.name;
        }

        public setIsPlayer(isAPLayer:boolean) {
            this.isAPLayer = isAPLayer;
        }

        public isPlayer():boolean {
            return this.isAPLayer;
        }

        static fromSerialization(data):GameObject {
            var go = new GameObject(parseInt(data.id));
            GameObject.assignSerializedData(go, data);
            return go;
        }

        static assignSerializedData(go:GameObject, data) {
            go.setPosition(new Coordinate(parseInt(data.x), parseInt(data.y)));
            go.setToken(data.token);
            go.setColorHex(data.color);
            go.setIsPlayer(data['is-player']);
            go.setName(data.name);
            go.setDescription(data.description);
            go.setCanBeWalkedThrough(data.canWalkOn);
        }
}
}