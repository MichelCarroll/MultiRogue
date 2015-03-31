/**
 * Created by michelcarroll on 15-03-22.
 */

/// <reference path="./Coordinate.ts" />

module Herbs {
    export class GameObject {

        private position:Coordinate;
        private id:number;
        private token:string;
        private colorHex:string;
        private canWalkOn:boolean;
        private name:string;
        private isAPLayer:boolean;

        constructor(id:number, position:Coordinate, token:string, colorHex:string) {
            this.position = position;
            this.id = id;
            this.token = token;
            this.colorHex = colorHex;
        }

        public getId():number {
            return this.id;
        }

        public setPosition(position:Coordinate) {
            this.position = position;
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
            var go = new GameObject(
                parseInt(data.id),
                new Coordinate(parseInt(data.x), parseInt(data.y)),
                data.token,
                data.color
            );
            go.setIsPlayer(data['is-player']);
            go.setName(data.name);
            go.setCanBeWalkedThrough(data.canWalkOn);
            return go;
        }
}
}