///<reference path='./bower_components/rot.js-TS/rot.d.ts' />
var Being = (function () {
    function Being(position, callForTurn) {
        this.position = position;
        this.callForTurn = callForTurn;
        this.id = Being.getNextId();
        this.turns = 0;
    }
    Being.getNextId = function () {
        return this.lastId++;
    };
    Being.prototype.getId = function () {
        return this.id;
    };
    Being.prototype.getPosition = function () {
        return this.position;
    };
    Being.prototype.setPosition = function (position) {
        this.position = position;
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
    Being.prototype.giveTurns = function (turns) {
        this.turns += turns;
    };
    Being.prototype.getRemainingTurns = function () {
        return this.turns;
    };
    Being.prototype.spendTurns = function (turns) {
        this.turns = Math.max(this.turns - turns, 0);
    };
    Being.prototype.serialize = function () {
        return {
            'id': this.getId(),
            'x': this.position.x,
            'y': this.position.y,
            'color': this.getColor(),
            'token': this.getToken()
        };
    };
    Being.lastId = 1;
    return Being;
})();
module.exports = Being;
//# sourceMappingURL=Being.js.map