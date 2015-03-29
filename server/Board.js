/**
 * Created by michelcarroll on 15-03-29.
 */
///<reference path='./ts-definitions/node.d.ts' />
var difference = require('array-difference');
var fs = require('fs');
eval(fs.readFileSync('./node_modules/rot.js/rot.js/rot.js', 'utf8'));
var Board = (function () {
    function Board(mapWidth, mapHeight) {
        this.width = mapWidth;
        this.height = mapHeight;
        this.tileMap = new Object();
        this.freeTiles = new Array();
        this.occupiedTiles = new Array();
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
    Board.prototype.getRandomUnoccupiedTile = function () {
        var unoccupiedTiles = difference(this.freeTiles, this.occupiedTiles);
        if (!unoccupiedTiles.length) {
            return;
        }
        var index = Math.floor(ROT.RNG.getUniform() * unoccupiedTiles.length);
        return unoccupiedTiles.splice(index, 1)[0];
    };
    Board.prototype.occupyTile = function (x, y) {
        this.occupiedTiles.push(x + "," + y);
    };
    Board.prototype.unoccupyTile = function (x, y) {
        var index = this.occupiedTiles.indexOf(x + "," + y);
        if (index > -1) {
            this.occupiedTiles.splice(index, 1);
        }
    };
    Board.prototype.isTileOccupied = function (x, y) {
        return (this.occupiedTiles.indexOf(x + "," + y) > -1);
    };
    return Board;
})();
module.exports = Board;
//# sourceMappingURL=Board.js.map