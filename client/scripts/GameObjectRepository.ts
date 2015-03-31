/**
 * Created by michelcarroll on 15-03-27.
 */

/// <reference path="./GameObject.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./Coordinate.ts" />

module Herbs {
    export class GameObjectRepository {

        private gos: { [id:number] : GameObject };
        private goStacks: { [position:string] : Array<GameObject> }

        constructor() {
            this.goStacks = {};
            this.gos = {};
        }

        public add(go:GameObject) {
            this.gos[go.getId()] = go;
            this.addToStack(go, go.getPosition());
        }

        public get(id:number) {
            return this.gos[id];
        }

        public remove(go:GameObject) {
            this.removeFromStack(go, go.getPosition());
            delete this.gos[go.getId()];
        }

        public move(go:GameObject, position:Coordinate):boolean {
            if(!this.allGOInStackAreWalkable(position.toString())) {
                return false;
            }

            this.removeFromStack(go, go.getPosition());
            go.setPosition(position);
            this.addToStack(go, go.getPosition());
            return true;
        }

        public getTopWalkableGameObjectOnStack(position:Coordinate):GameObject {
            var key = position.toString();
            if(!this.goStacks[key]) {
                return;
            }
            for(var i = 0; i < this.goStacks[key].length; i++) {
                if(this.goStacks[key][i].canBeWalkedThrough()) {
                    return this.goStacks[key][i];
                }
            }
        }

        public getTopGameObjectOnStack(position:Coordinate):GameObject {
            var key = position.toString();
            if(!this.goStacks[key] || !this.goStacks[key].length) {
                return;
            }

            return this.goStacks[key][0];
        }

        private addToStack(go:GameObject, position:Coordinate) {
            var key = position.toString();
            if(!this.goStacks[key]) {
                this.goStacks[key] = new Array();
            }
            this.goStacks[key].push(go);
            this.sortStack(key);
        }

        private sortStack(stackKey:string) {
            this.goStacks[stackKey].sort(function(a:GameObject,b:GameObject):number {
                if(a.canBeWalkedThrough() === b.canBeWalkedThrough()) {
                    return 0;
                }
                else if(!a.canBeWalkedThrough()) {
                    return -1;
                }
                return 1;
            })
        }

        private removeFromStack(go:GameObject, position:Coordinate) {
            var key = position.toString();
            if(!this.goStacks[key]) {
                return;
            }
            var index = this.findGOIndexInStack(position.toString(), go);
            if(index !== -1) {
                this.goStacks[key].splice(index, 1);
            }
        }

        private findGOIndexInStack(stackKey:string, go:GameObject):number {
            for(var i = 0; i < this.goStacks[stackKey].length; i++) {
                if(this.goStacks[stackKey][i].getId() === go.getId()) {
                    return i;
                }
            }
            return -1;
        }

        private allGOInStackAreWalkable(stackKey:string):boolean {
            if(!this.goStacks[stackKey]) {
                return true;
            }
            for(var i = 0; i < this.goStacks[stackKey].length; i++) {
                if(!this.goStacks[stackKey][i].canBeWalkedThrough()) {
                    return false;
                }
            }
            return true;
        }
    }

}
