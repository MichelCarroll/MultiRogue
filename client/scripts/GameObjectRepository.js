/**
 * Created by michelcarroll on 15-03-27.
 */
/// <reference path="./GameObject.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./Coordinate.ts" />
var Herbs;
(function (Herbs) {
    var GameObjectRepository = (function () {
        function GameObjectRepository() {
            this.goStacks = {};
            this.gos = {};
        }
        GameObjectRepository.prototype.add = function (go) {
            this.gos[go.getId()] = go;
            this.addToStack(go, go.getPosition());
        };
        GameObjectRepository.prototype.get = function (id) {
            return this.gos[id];
        };
        GameObjectRepository.prototype.remove = function (go) {
            this.removeFromStack(go, go.getPosition());
            delete this.gos[go.getId()];
        };
        GameObjectRepository.prototype.move = function (go, position) {
            if (!this.allGOInStackAreWalkable(position.toString())) {
                return false;
            }
            this.removeFromStack(go, go.getPosition());
            go.setPosition(position);
            this.addToStack(go, go.getPosition());
            return true;
        };
        GameObjectRepository.prototype.getTopGameObjectOnStack = function (position) {
            var key = position.toString();
            if (!this.goStacks[key] || !this.goStacks[key].length) {
                return;
            }
            return this.goStacks[key][0];
        };
        GameObjectRepository.prototype.addToStack = function (go, position) {
            var key = position.toString();
            if (!this.goStacks[key]) {
                this.goStacks[key] = new Array();
            }
            this.goStacks[key].push(go);
            this.sortStack(key);
        };
        GameObjectRepository.prototype.sortStack = function (stackKey) {
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
        GameObjectRepository.prototype.removeFromStack = function (go, position) {
            var key = position.toString();
            if (!this.goStacks[key]) {
                return;
            }
            var index = this.findGOIndexInStack(position.toString(), go);
            if (index !== -1) {
                this.goStacks[key].splice(index, 1);
            }
        };
        GameObjectRepository.prototype.findGOIndexInStack = function (stackKey, go) {
            for (var i = 0; i < this.goStacks[stackKey].length; i++) {
                if (this.goStacks[stackKey][i].getId() === go.getId()) {
                    return i;
                }
            }
            return -1;
        };
        GameObjectRepository.prototype.allGOInStackAreWalkable = function (stackKey) {
            if (!this.goStacks[stackKey]) {
                return true;
            }
            for (var i = 0; i < this.goStacks[stackKey].length; i++) {
                if (!this.goStacks[stackKey][i].canBeWalkedThrough()) {
                    return false;
                }
            }
            return true;
        };
        return GameObjectRepository;
    })();
    Herbs.GameObjectRepository = GameObjectRepository;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=GameObjectRepository.js.map