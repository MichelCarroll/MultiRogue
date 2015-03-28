/**
 * Created by michelcarroll on 15-03-22.
 */
var Herbs;
(function (Herbs) {
    var Being = (function () {
        function Being(id, x, y) {
            this.x = x;
            this.y = y;
            this.id = id;
        }
        Being.prototype.getId = function () {
            return this.id;
        };
        Being.prototype.getX = function () {
            return this.x;
        };
        Being.prototype.getY = function () {
            return this.y;
        };
        Being.prototype.setX = function (x) {
            this.x = x;
        };
        Being.prototype.setY = function (y) {
            this.y = y;
        };
        Being.prototype.getToken = function () {
            return '@';
        };
        Being.prototype.getColor = function () {
            return '#FF0';
        };
        Being.fromSerialization = function (data) {
            return new Being(parseInt(data.id), parseInt(data.x), parseInt(data.y));
        };
        return Being;
    })();
    Herbs.Being = Being;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=Being.js.map