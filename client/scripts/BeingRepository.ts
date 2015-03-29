/**
 * Created by michelcarroll on 15-03-27.
 */

/// <reference path="./Being.ts" />
/// <reference path="./Board.ts" />

module Herbs {
    export class BeingRepository {

        private beingBoard:Board;
        private beings: { [id:number] : Being };

        constructor(beingBoard:Board) {
            this.beingBoard = beingBoard;
            this.beings = {};
        }

        public add(being:Being) {
            this.beings[being.getId()] = being;
            this.beingBoard.setTile(being.getX(), being.getY(), being);
        }

        public get(id:number) {
            return this.beings[id];
        }

        public remove(id:number) {
            var being = this.beings[id];
            if(being) {
                if(this.beingBoard.getTile(being.getX(), being.getY()) === being) {
                    this.beingBoard.deleteTile(being.getX(), being.getY());
                }
                delete this.beings[id];
            }
        }

        public move(being:Being, x, y)
        {
            this.beingBoard.deleteTile(being.getX(), being.getY());
            being.setX(x);
            being.setY(y);
            this.beingBoard.setTile(being.getX(), being.getY(), being);
        }

    }

}
