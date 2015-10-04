

import ItemGenerator = require('./ItemGenerator');
import FloorGenerator = require('./FloorGenerator');
import Level = require('./../Level');
import Vector2D = require('../../common/Vector2D');
import GameObject = require('../../common/GameObject');
import ROT = require('./../ROT');

class LevelGenerator {

    private numberedTilesIndex:GameObject[] = [];

    public create():Level {
        var level = new Level(new Vector2D(100,50));
        this.traceMap(level);
        level.setActorSpawnSpot(this.getRandomTile().getPosition());
        this.addRandomSticks(level, 100);
        return level;
    }
g
    private getRandomTile():GameObject {
        if(!this.numberedTilesIndex.length) {
            return null;
        }
        var index = Math.floor(ROT.RNG.getUniform() * this.numberedTilesIndex.length);
        return this.numberedTilesIndex[index];
    }

    private addRandomSticks(level:Level, n:number) {
        for(var i = 0; i < n; i++) {
            var item = ItemGenerator.createRandomSticks(
                ROT.Color.toHex(ROT.Color.randomize([205, 133, 63],[20,20,20])),
                this.getRandomTile().getPosition()
            );
            level.addGameObject(item);
        }
    }

    private traceMap(level:Level) {
        var digger = new ROT.Map.Digger(100,50);
        var self = this;
        digger.create(function(x, y, value) {
            if (value) { return; } /* do not store walls */
            var go = FloorGenerator.create(new Vector2D(x, y));
            self.numberedTilesIndex.push(go);
            level.addGameObject(go);
        });
    }

}

export = LevelGenerator;