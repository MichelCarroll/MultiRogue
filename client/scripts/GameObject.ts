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

        static fromSerialization(data):GameObject {
            var go = new GameObject(
                parseInt(data.id),
                new Coordinate(parseInt(data.x), parseInt(data.y)),
                data.token,
                data.color
            );
            go.setCanBeWalkedThrough(data.canWalkOn);
            return go;
        }
}
}