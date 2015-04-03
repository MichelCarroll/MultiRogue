/**
 * Created by michelcarroll on 15-04-03.
 */
/// <reference path="./GameObject.ts" />
/// <reference path="./Coordinate.ts" />
var Herbs;
(function (Herbs) {
    var GameObjectLayer = (function () {
        function GameObjectLayer() {
            this.goStacks = {};
        }
        GameObjectLayer.prototype.add = function (go, position) {
            var key = position.toString();
            if (!this.goStacks[key]) {
                this.goStacks[key] = new Array();
            }
            this.goStacks[key].push(go);
            this.sortStack(key);
        };
        GameObjectLayer.prototype.sortStack = function (stackKey) {
            this.goStacks[stackKey].sort(function (a, b) {
                if (a.canBeWalkedThrough() === b.canBeWalkedThrough()) {
                    return 0;
                }
                else if (!a.canBeWalkedThrough()) {
                    return -1;
                }
                return 1;
            });
        };
        GameObjectLayer.prototype.remove = function (go, position) {
            var key = position.toString();
            if (!this.goStacks[key]) {
                return;
            }
            var index = this.findGameObjectIndex(position.toString(), go);
            if (index !== -1) {
                this.goStacks[key].splice(index, 1);
            }
        };
        GameObjectLayer.prototype.blocked = function (stackKey) {
            if (!this.goStacks[stackKey]) {
                return false;
            }
            for (var i = 0; i < this.goStacks[stackKey].length; i++) {
                if (!this.goStacks[stackKey][i].canBeWalkedThrough()) {
                    return true;
                }
            }
            return false;
        };
        GameObjectLayer.prototype.findGameObjectIndex = function (stackKey, go) {
            for (var i = 0; i < this.goStacks[stackKey].length; i++) {
                if (this.goStacks[stackKey][i].getId() === go.getId()) {
                    return i;
                }
            }
            return -1;
        };
        GameObjectLayer.prototype.getTopWalkableGameObject = function (position) {
            var key = position.toString();
            if (!this.goStacks[key]) {
                return;
            }
            for (var i = 0; i < this.goStacks[key].length; i++) {
                if (this.goStacks[key][i].canBeWalkedThrough()) {
                    return this.goStacks[key][i];
                }
            }
        };
        GameObjectLayer.prototype.getTopPickupableGameObject = function (position) {
            var key = position.toString();
            if (!this.goStacks[key]) {
                return;
            }
            for (var i = 0; i < this.goStacks[key].length; i++) {
                if (this.goStacks[key][i].canBePickedUp()) {
                    return this.goStacks[key][i];
                }
            }
        };
        GameObjectLayer.prototype.getTopGameObject = function (position) {
            var key = position.toString();
            if (!this.goStacks[key] || !this.goStacks[key].length) {
                return;
            }
            return this.goStacks[key][0];
        };
        return GameObjectLayer;
    })();
    Herbs.GameObjectLayer = GameObjectLayer;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=GameObjectLayer.js.map