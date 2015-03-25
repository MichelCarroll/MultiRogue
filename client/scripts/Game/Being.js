/**
 * Created by michelcarroll on 15-03-22.
 */
/// <reference path="../../bower_components/rot.js-TS/rot.d.ts"/>
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
        return '#888';
    };
    return Being;
})();
//# sourceMappingURL=Being.js.map