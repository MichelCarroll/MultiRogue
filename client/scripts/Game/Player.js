/**
 * Created by michelcarroll on 15-03-22.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./Being.ts" />
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        _super.apply(this, arguments);
    }
    Player.prototype.getToken = function () {
        return '@';
    };
    Player.prototype.getColor = function () {
        return '#FF0';
    };
    return Player;
})(Being);
//# sourceMappingURL=Player.js.map