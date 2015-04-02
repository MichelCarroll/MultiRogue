/**
 * Created by michelcarroll on 15-03-22.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="./GameObject.ts" />
var Herbs;
(function (Herbs) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(id) {
            _super.call(this, id);
            this.actionTurns = 0;
            this.inventory = {};
        }
        Player.prototype.addToInventory = function (go) {
            if (this.inventory[go.getId()]) {
                return;
            }
            this.inventory[go.getId()] = go;
        };
        Player.prototype.removeFromToInventory = function (go) {
            if (!this.inventory[go.getId()]) {
                return;
            }
            delete this.inventory[go.getId()];
        };
        Player.prototype.getInventory = function () {
            var self = this;
            return Object.getOwnPropertyNames(this.inventory).map(function (key) {
                return self.inventory[key];
            });
        };
        Player.prototype.getRemainingActionTurns = function () {
            return this.actionTurns;
        };
        Player.prototype.giveTurns = function (turns) {
            this.actionTurns += turns;
        };
        Player.prototype.useTurns = function (turns) {
            this.actionTurns = Math.max(this.actionTurns - turns, 0);
        };
        Player.fromSerialization = function (data) {
            var player = new Player(parseInt(data.id));
            Herbs.GameObject.assignSerializedData(player, data);
            return player;
        };
        return Player;
    })(Herbs.GameObject);
    Herbs.Player = Player;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=Player.js.map