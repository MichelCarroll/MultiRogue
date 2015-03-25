///<reference path='./bower_components/rot.js-TS/rot.d.ts' />
var Being = (function () {
    function Being(x, y, handleAct) {
        this.x = x;
        this.y = y;
        this.handleAct = handleAct;
        this.id = Being.getNextId();
    }
    Being.getNextId = function () {
        return this.lastId++;
    };
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
    Being.prototype.act = function () {
        this.handleAct(this);
    };
    Being.prototype.serialize = function () {
        return {
            'id': this.getId(),
            'x': this.getX(),
            'y': this.getY(),
            'color': this.getColor(),
            'token': this.getToken()
        };
    };
    Being.lastId = 1;
    return Being;
})();
module.exports = Being;
//# sourceMappingURL=Being.js.map