/**
 * Created by michelcarroll on 15-03-29.
 */

import Board = require('./Board');
import Being = require('./Being');


class BeingRepository {

    private beingBoard:Board;
    private beings: { [id:number] : Being };

    constructor(beingBoard:Board) {
        this.beingBoard = beingBoard;
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
        delete this.beings[being.getId()];
    }

    public add(being:Being) {
       this.beings[being.getId()] = being;
    }

}

export = BeingRepository;