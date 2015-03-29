/**
 * Created by michelcarroll on 15-03-29.
 */
///<reference path='./ts-definitions/node.d.ts' />
var difference = require('array-difference');
var fs = require('fs');
eval(fs.readFileSync('./node_modules/rot.js/rot.js/rot.js', 'utf8'));
var Coordinate = require('./Coordinate');
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
    Board.prototype.addTile = function (position) {
        this.freeTiles.push(position.toString());
        this.tileMap[position.toString()] = ".";
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
        return Coordinate.fromString(unoccupiedTiles.splice(index, 1)[0]);
    };
    Board.prototype.occupyTile = function (position) {
        this.occupiedTiles.push(position.toString());
    };
    Board.prototype.unoccupyTile = function (position) {
        var index = this.occupiedTiles.indexOf(position.toString());
        if (index > -1) {
            this.occupiedTiles.splice(index, 1);
        }
    };
    Board.prototype.isTileOccupied = function (position) {
        return (this.occupiedTiles.indexOf(position.toString()) > -1);
    };
    return Board;
})();
module.exports = Board;
//# sourceMappingURL=Board.js.map