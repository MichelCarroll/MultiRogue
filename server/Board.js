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
        this.tiles = new Array();
    }
    Board.prototype.getTileMap = function () {
        return this.tileMap;
    };
    Board.prototype.addTile = function (position) {
        this.tiles.push(position.toString());
        this.tileMap[position.toString()] = ".";
    };
    Board.prototype.getWidth = function () {
        return this.width;
    };
    Board.prototype.getHeight = function () {
        return this.height;
    };
    Board.prototype.getRandomUnoccupiedTile = function () {
        var index = Math.floor(ROT.RNG.getUniform() * this.tiles.length);
        return Coordinate.fromString(this.tiles[index]);
    };
    Board.prototype.tileExists = function (position) {
        return (this.tiles.indexOf(position.toString()) > -1);
    };
    return Board;
})();
module.exports = Board;
//# sourceMappingURL=Board.js.map