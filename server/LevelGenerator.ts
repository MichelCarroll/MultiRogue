/**
 * Created by michelcarroll on 15-03-29.
 */

///<reference path='./ts-definitions/node.d.ts' />
///<reference path='./bower_components/rot.js-TS/rot.d.ts' />

var fs = require('fs');
eval(fs.readFileSync('./node_modules/rot.js/rot.js/rot.js','utf8'));

import Being = require('./Being');
import GameObject = require('./GameObject');
import Board = require('./Board');
import Level = require('./Level');
import Coordinate = require('./Coordinate');

class LevelGenerator {

    public create():Level {
        var map = new Board(100,50);
        this.traceMap(map);
        var level = new Level(map);
        this.addRandomSticks(level, map, 100);
        return level;
    }

    private addRandomSticks(level:Level, map:Board, n:number) {
        for(var i = 0; i < n; i++) {
            level.addImmobile(new GameObject(
                map.getRandomTile(),
                '/',
                ROT.Color.toHex(ROT.Color.randomize([205, 133, 63],[20,20,20]))
            ));
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