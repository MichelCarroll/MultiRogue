/**
 * Created by michelcarroll on 15-03-29.
 */


var fs = require('fs');

import Renderable = require('./../common/Components/Renderable');
import Item = require('./../common/Item');
import Board = require('./../common/Board');
import Level = require('./Level');
import Vector2D = require('../common/Vector2D');
import ROT = require('./ROT');

class LevelGenerator {

    public create():Level {
        var map = new Board({}, new Vector2D(100,50));
        this.traceMap(map);
        var level = new Level(map);
        this.addRandomSticks(level, map, 100);
        return level;
    }

    private addRandomSticks(level:Level, map:Board, n:number) {
        var indexLength = map.getTileIndexLength();
        for(var i = 0; i < n; i++) {
            var item = new Item();
            var renderable = new Renderable();
            renderable.setProperties({
                'token': '/',
                'frontColor': ROT.Color.toHex(ROT.Color.randomize([205, 133, 63],[20,20,20])),
                'backColor': ''
            });
            item.addComponent(renderable);
            item.setName('Wooden Stick');
            item.setDescription('a simple piece of wood');
            item.setPosition(map.getTileAtIndex(Math.floor(ROT.RNG.getUniform() * indexLength)));
            level.addImmobile(item);
        }
    }

    private traceMap(map:Board) {
        var digger = new ROT.Map.Digger(100,50);
        digger.create(function(x, y, value) {
            if (value) { return; } /* do not store walls */
            map.addTile(new Vector2D(x, y));
        });
    }

}

export = LevelGenerator;