/**
 * Created by michelcarroll on 15-03-29.
 */
///<reference path='./ts-definitions/node.d.ts' />
///<reference path='./bower_components/rot.js-TS/rot.d.ts' />
var fs = require('fs');
eval(fs.readFileSync(__dirname + '/node_modules/rot.js/rot.js/rot.js', 'utf8'));
var Item = require('./Item');
var Board = require('./Board');
var Level = require('./Level');
var Coordinate = require('./Coordinate');
var LevelGenerator = (function () {
    function LevelGenerator() {
    }
    LevelGenerator.prototype.create = function () {
        var map = new Board(100, 50);
        this.traceMap(map);
        var level = new Level(map);
        this.addRandomSticks(level, map, 100);
        return level;
    };
    LevelGenerator.prototype.addRandomSticks = function (level, map, n) {
        for (var i = 0; i < n; i++) {
            level.addImmobile(new Item(map.getRandomTile(), '/', ROT.Color.toHex(ROT.Color.randomize([205, 133, 63], [20, 20, 20])), 'Wooden Stick', 'a simple piece of wood'));
        }
    };
    LevelGenerator.prototype.traceMap = function (map) {
        var digger = new ROT.Map.Digger(100, 50);
        digger.create(function (x, y, value) {
            if (value) {
                return;
            } /* do not store walls */
            map.addTile(new Coordinate(x, y));
        });
    };
    return LevelGenerator;
})();
module.exports = LevelGenerator;
//# sourceMappingURL=LevelGenerator.js.map