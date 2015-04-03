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
        Coordinate.prototype.copy = function () {
            return new Coordinate(this.x, this.y);
        };
        return Coordinate;
    })();
    Herbs.Coordinate = Coordinate;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=Coordinate.js.map