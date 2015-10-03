

import ItemGenerator = require('./ItemGenerator');
import FloorGenerator = require('./FloorGenerator');
import Level = require('./../Level');
import Vector2D = require('../../common/Vector2D');
import ROT = require('./../ROT');

class LevelGenerator {

    public create():Level {
        var level = new Level(new Vector2D(100,50));
        this.traceMap(level);
        level.setActorSpawnSpot(level.getRandomTile().getPosition());
        this.addRandomSticks(level, 100);
        return level;
    }

    private addRandomSticks(level:Level, n:number) {
        for(var i = 0; i < n; i++) {
            var item = ItemGenerator.createRandomSticks(
                ROT.Color.toHex(ROT.Color.randomize([205, 133, 63],[20,20,20])),
                level.getRandomTile().getPosition()
            );
            level.addGameObject(item);
        }
    }

    private traceMap(level:Level) {
        var digger = new ROT.Map.Digger(100,50);
        digger.create(function(x, y, value) {
            if (value) { return; } /* do not store walls */
            level.addTile(FloorGenerator.create(new Vector2D(x, y)));
        });
    }

}

export = LevelGenerator;