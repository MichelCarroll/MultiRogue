/**
 * Created by michelcarroll on 15-03-29.
 */
var Herbs;
(function (Herbs) {
    var Coordinate = (function () {
        function Coordinate(x, y) {
            this.x = x;
            this.y = y;
        }
        Coordinate.prototype.add = function (x, y) {
            return new Coordinate(this.x + x, this.y + y);
        };
        Coordinate.prototype.toString = function () {
            return this.x + "," + this.y;
        };
        Coordinate.fromString = function (str) {
            var parts = str.split(",");
            return new Coordinate(parseInt(parts[0]), parseInt(parts[1]));
        };
        Coordinate.prototype.equals = function (coord) {
            return this.x === coord.x && this.y === coord.y;
        };
        return Coordinate;
    })();
    Herbs.Coordinate = Coordinate;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=Coordinate.js.map