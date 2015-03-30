/**
 * Created by michelcarroll on 15-03-27.
 */

/// <reference path="./GameObject.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./Coordinate.ts" />

module Herbs {
    export class GameObjectRepository {

        private goBoard:Board;
        private gos: { [id:number] : GameObject };

        constructor(goBoard:Board) {
            this.goBoard = goBoard;
            this.gos = {};
        }

        public add(go:GameObject) {
            this.gos[go.getId()] = go;
            this.goBoard.setTile(go.getPosition(), go);
        }

        public get(id:number) {
            return this.gos[id];
        }

        public remove(id:number) {
            var go = this.gos[id];
            if(go) {
                if(this.goBoard.getTile(go.getPosition()) === go) {
                    this.goBoard.deleteTile(go.getPosition());
                }
                delete this.gos[id];
            }
        }

        public move(go:GameObject, position:Coordinate) {
            var foundGo = this.goBoard.getTile(position);
            if(foundGo && !foundGo.canBeWalkedThrough()) {
                return false;
            }

            this.goBoard.deleteTile(go.getPosition());
            go.setPosition(position);
            this.goBoard.setTile(position, go);
            return true;
        }

    }

}
