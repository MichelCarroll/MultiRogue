/**
 * Created by michelcarroll on 15-03-27.
 */

/// <reference path="./GameObject.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./Coordinate.ts" />
/// <reference path="./GameObjectLayer.ts" />

module Herbs {
    export class GameObjectRepository {

        private gos:{ [id:number] : GameObject };
        private layer:GameObjectLayer;

        constructor() {
            this.layer = new GameObjectLayer();
            this.gos = {};
        }

        public add(go:GameObject) {
            this.gos[go.getId()] = go;
            this.layer.add(go, go.getPosition());
        }

        public get(id:number) {
            if (!this.has(id)) {
                throw new Error('No GO with ID: ' + id);
            }
            return this.gos[id];
        }

        public has(id:number) {
            return this.gos.hasOwnProperty(id.toString());
        }

        public remove(go:GameObject) {
            this.layer.remove(go, go.getPosition());
            delete this.gos[go.getId()];
        }


        public move(go:GameObject, position:Coordinate):boolean {
            if (this.layer.blocked(position.toString())) {
                return false;
            }

            this.layer.remove(go, go.getPosition());
            go.setPosition(position);
            this.layer.add(go, go.getPosition());
            return true;
        }


        public pickUpByPlayer(go:GameObject, player:Player) {
            player.addToInventory(go);
            this.remove(go);
        }

        public dropByPlayer(go:GameObject, player:Player) {
            player.removeFromInventory(go);
            go.setPosition(player.getPosition().copy());
            this.add(go);
        }


        public getTopGroundObject(position:Coordinate):GameObject {
            return this.layer.getTopWalkableGameObject(position);
        }

        public getTopItem(position:Coordinate):GameObject {
            return this.layer.getTopPickupableGameObject(position);
        }

        public getGameObjectLayer():GameObjectLayer {
            return this.layer;
        }

    }
}