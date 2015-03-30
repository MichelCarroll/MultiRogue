/**
 * Created by michelcarroll on 15-03-28.
 */
/// <reference path="./GameObject.ts" />
var Herbs;
(function (Herbs) {
    var PlayerCommand = (function () {
        function PlayerCommand(turnCost, executeCallback) {
            this.turnCost = turnCost;
            this.executeCallback = executeCallback;
        }
        PlayerCommand.prototype.getTurnCost = function () {
            return this.turnCost;
        };
        PlayerCommand.prototype.execute = function () {
            return this.executeCallback();
        };
        return PlayerCommand;
    })();
    Herbs.PlayerCommand = PlayerCommand;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=PlayerCommand.js.map