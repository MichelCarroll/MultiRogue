/**
 * Created by michelcarroll on 15-03-29.
 */
///<reference path='./ts-definitions/node.d.ts' />
var fs = require('fs');
eval(fs.readFileSync('./node_modules/rot.js/rot.js/rot.js', 'utf8'));
var Board = (function () {
    function Board(mapWidth, mapHeight) {
        this.width = mapWidth;
        this.height = mapHeight;
        this.tileMap = new Object();
        this.freeTiles = new Array();
    }
    Board.prototype.getTileMap = function () {
        return this.tileMap;
    };
    Board.prototype.addTile = function (x, y) {
        var key = x + "," + y;
        this.freeTiles.push(key);
        this.tileMap[key] = ".";
    };
    Board.prototype.getWidth = function () {
        return this.width;
    };
    Board.prototype.getHeight = function () {
        return this.height;
    };
    Board.prototype.getRandomFreeTileKey = function () {
        var index = Math.floor(ROT.RNG.getUniform() * this.freeTiles.length);
        return this.freeTiles.splice(index, 1)[0];
    };
    return Board;
})();
module.exports = Board;
//# sourceMappingURL=Board.js.map