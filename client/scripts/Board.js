/**
 * Created by michelcarroll on 15-03-27.
 */
var Herbs;
(function (Herbs) {
    var Board = (function () {
        function Board() {
            this.map = new Object();
        }
        Board.prototype.getTile = function (x, y) {
            return this.map[x + "," + y];
        };
        Board.prototype.tileExists = function (x, y) {
            return (this.map.hasOwnProperty(x + "," + y));
        };
        Board.prototype.setTileMap = function (tileMap) {
            this.map = tileMap;
        };
        Board.prototype.setTile = function (x, y, val) {
            this.map[x + "," + y] = val;
        };
        Board.prototype.deleteTile = function (x, y) {
            delete this.map[x + "," + y];
        };
        return Board;
    })();
    Herbs.Board = Board;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=Board.js.map