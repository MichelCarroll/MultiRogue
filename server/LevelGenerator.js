/**
 * Created by michelcarroll on 15-03-29.
 */
///<reference path='./ts-definitions/node.d.ts' />
///<reference path='./bower_components/rot.js-TS/rot.d.ts' />
var fs = require('fs');
eval(fs.readFileSync('./node_modules/rot.js/rot.js/rot.js', 'utf8'));
var Board = require('./Board');
var Level = require('./Level');
var Coordinate = require('./Coordinate');
var LevelGenerator = (function () {
    function LevelGenerator() {
    }
    LevelGenerator.prototype.create = function () {
        var map = new Board(100, 50);
        this.traceMap(map);
        return new Level(map);
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