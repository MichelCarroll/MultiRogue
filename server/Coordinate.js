/**
 * Created by michelcarroll on 15-03-29.
 */
var Coordinate = (function () {
    function Coordinate(x, y) {
        this.x = x;
        this.y = y;
    }
    Coordinate.prototype.toString = function () {
        return this.x + "," + this.y;
    };
    Coordinate.fromString = function (str) {
        var parts = str.split(",");
        return new Coordinate(parseInt(parts[0]), parseInt(parts[1]));
    };
    return Coordinate;
})();
module.exports = Coordinate;
//# sourceMappingURL=Coordinate.js.map