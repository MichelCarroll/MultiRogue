/**
 * Created by michelcarroll on 15-03-29.
 */
///<reference path='./ts-definitions/node.d.ts' />
var difference = require('array-difference');
var fs = require('fs');
eval(fs.readFileSync(__dirname + '/node_modules/rot.js/rot.js/rot.js', 'utf8'));
var Coordinate = require('./Coordinate');
var Board = (function () {
    function Board(size) {
        this.size = size;
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
        return this.size.x;
    };
    Board.prototype.getHeight = function () {
        return this.size.y;
    };
    Board.prototype.getRandomTile = function () {
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