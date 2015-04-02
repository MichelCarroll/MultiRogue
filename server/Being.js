///<reference path='./bower_components/rot.js-TS/rot.d.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var fs = require('fs');
eval(fs.readFileSync(__dirname + '/node_modules/rot.js/rot.js/rot.js', 'utf8'));
var GameObject = require('./GameObject');
var Being = (function (_super) {
    __extends(Being, _super);
    function Being(position, callForTurn) {
        _super.call(this, position, '@', "#FF0", '', 'a player character');
        this.setName('Player #' + this.getId());
        this.callForTurn = callForTurn;
        this.turns = 0;
    }
    Being.prototype.askToTakeTurn = function () {
        this.callForTurn();
    };
    Being.prototype.giveTurns = function (turns) {
        this.turns += turns;
    };
    Being.prototype.canBeWalkedThrough = function () {
        return false;
    };
    Being.prototype.getRemainingTurns = function () {
        return this.turns;
    };
    Being.prototype.spendTurns = function (turns) {
        this.turns = Math.max(this.turns - turns, 0);
    };
    Being.prototype.serialize = function () {
        var data = _super.prototype.serialize.call(this);
        data.isPlayer = true;
        return data;
    };
    return Being;
})(GameObject);
module.exports = Being;
//# sourceMappingURL=Being.js.map