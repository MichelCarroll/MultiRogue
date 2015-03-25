/**
 * Created by michelcarroll on 15-03-22.
 */
/// <reference path="../../bower_components/rot.js-TS/rot.d.ts"/>
var Being = (function () {
    function Being(x, y, handleAct) {
        this.x = x;
        this.y = y;
        this.handleAct = handleAct;
    }
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
    Being.prototype.act = function () {
        this.handleAct(this);
    };
    return Being;
})();
//# sourceMappingURL=Being.js.map