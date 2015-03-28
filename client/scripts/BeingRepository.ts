/**
 * Created by michelcarroll on 15-03-27.
 */

/// <reference path="./Being.ts" />
/// <reference path="./Map.ts" />

module Herbs {
    export class BeingRepository {

        private beingMap:Map;
        private beings: { [id:number] : Being };

        constructor(beingMap:Map) {
            this.beingMap = beingMap;
            this.beings = {};
        }

        public add(being:Being) {
            this.beings[being.getId()] = being;
            this.beingMap.setTile(being.getX(), being.getY(), being);
        }

        public get(id:number) {
            return this.beings[id];
        }

        public remove(id:number) {
            var being = this.beings[id];
            if(being) {
                if(this.beingMap.getTile(being.getX(), being.getY()) === being) {
                    this.beingMap.deleteTile(being.getX(), being.getY());
                }
                delete this.beings[id];
            }
        }

        public move(being:Being, x, y)
        {
            this.beingMap.deleteTile(being.getX(), being.getY());
            being.setX(x);
            being.setY(y);
            this.beingMap.setTile(being.getX(), being.getY(), being);
        }

    }

}
