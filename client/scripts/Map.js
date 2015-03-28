/**
 * Created by michelcarroll on 15-03-27.
 */
var Herbs;
(function (Herbs) {
    var Map = (function () {
        function Map() {
            this.map = new Object();
        }
        Map.prototype.getTile = function (x, y) {
            return this.map[x + "," + y];
        };
        Map.prototype.tileExists = function (x, y) {
            return (this.map.hasOwnProperty(x + "," + y));
        };
        Map.prototype.setTileMap = function (tileMap) {
            this.map = tileMap;
        };
        Map.prototype.setTile = function (x, y, val) {
            this.map[x + "," + y] = val;
        };
        Map.prototype.deleteTile = function (x, y) {
            delete this.map[x + "," + y];
        };
        return Map;
    })();
    Herbs.Map = Map;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=Map.js.map