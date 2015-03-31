/**
 * Created by michelcarroll on 15-03-27.
 */
/// <reference path="./Coordinate.ts" />
var Herbs;
(function (Herbs) {
    var Board = (function () {
        function Board(tileMap, width, height) {
            this.map = tileMap;
            this.width = width;
            this.height = height;
        }
        Board.prototype.getWidth = function () {
            return this.width;
        };
        Board.prototype.getHeight = function () {
            return this.height;
        };
        Board.prototype.getTile = function (position) {
            return this.map[position.toString()];
        };
        Board.prototype.tileExists = function (position) {
            return (this.map.hasOwnProperty(position.toString()));
        };
        Board.prototype.setTile = function (position, val) {
            this.map[position.toString()] = val;
        };
        Board.prototype.deleteTile = function (position) {
            delete this.map[position.toString()];
        };
        return Board;
    })();
    Herbs.Board = Board;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=Board.js.map