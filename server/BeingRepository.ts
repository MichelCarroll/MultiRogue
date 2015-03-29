/**
 * Created by michelcarroll on 15-03-29.
 */

import Board = require('./Board');
import Being = require('./Being');


class BeingRepository {

    private board:Board;
    private beings: { [id:number] : Being };

    constructor(board:Board) {
        this.board = board;
        this.beings = {};
    }

    public get(id:number) {
        return this.beings[id];
    }

    public serialize() {
        var beingSerialized = new Array();
        for(var index in this.beings) {
            var being = this.beings[index];
            beingSerialized.push(being.serialize());
        }
        return beingSerialized;
    }

    public delete(being:Being) {
        this.board.unoccupyTile(being.getX(), being.getY());
        delete this.beings[being.getId()];
    }

    public add(being:Being) {
        this.beings[being.getId()] = being;
        this.board.occupyTile(being.getX(), being.getY());
    }

    public move(being:Being, x:number, y:number) {
        this.board.unoccupyTile(being.getX(), being.getY());
        being.setX(x);
        being.setY(y);
        this.board.occupyTile(being.getX(), being.getY());
    }

}

export = BeingRepository;