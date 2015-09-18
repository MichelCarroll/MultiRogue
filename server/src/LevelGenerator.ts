/**
 * Created by michelcarroll on 15-03-29.
 */


var fs = require('fs');

import Being = require('./Being');
import Item = require('./Item');
import Board = require('./Board');
import Level = require('./Level');
import Coordinate = require('./Coordinate');
import ROT = require('./ROT');

class LevelGenerator {

    public create():Level {
        var map = new Board(new Coordinate(100,50));
        this.traceMap(map);
        var level = new Level(map);
        this.addRandomSticks(level, map, 100);
        return level;
    }

    private addRandomSticks(level:Level, map:Board, n:number) {
        for(var i = 0; i < n; i++) {
            var item = new Item(
                '/',
                ROT.Color.toHex(ROT.Color.randomize([205, 133, 63],[20,20,20])),
                'Wooden Stick',
                'a simple piece of wood'
            );
            item.setPosition(map.getRandomTile());
            level.addImmobile(item);
        }
    }

    private traceMap(map:Board) {
        var digger = new ROT.Map.Digger(100,50);
        digger.create(function(x, y, value) {
            if (value) { return; } /* do not store walls */
            map.addTile(new Coordinate(x, y));
        });
    }

}

export = LevelGenerator;