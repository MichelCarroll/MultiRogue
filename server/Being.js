///<reference path='./bower_components/rot.js-TS/rot.d.ts' />
var Being = (function () {
    function Being(x, y, callForTurn) {
        this.x = x;
        this.y = y;
        this.callForTurn = callForTurn;
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
    Being.prototype.askToTakeTurn = function () {
        this.callForTurn();
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