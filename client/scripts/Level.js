/**
 * Created by michelcarroll on 15-03-27.
 */
/// <reference path="./GameObject.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./Coordinate.ts" />
/// <reference path="./GameObjectLayer.ts" />
var Herbs;
(function (Herbs) {
    var Level = (function () {
        function Level() {
            this.layer = new Herbs.GameObjectLayer();
            this.gos = {};
        }
        Level.prototype.add = function (go) {
            this.gos[go.getId()] = go;
            this.layer.add(go, go.getPosition());
        };
        Level.prototype.get = function (id) {
            if (!this.has(id)) {
                throw new Error('No GO with ID: ' + id);
            }
            return this.gos[id];
        };
        Level.prototype.has = function (id) {
            return this.gos.hasOwnProperty(id.toString());
        };
        Level.prototype.remove = function (go) {
            this.layer.remove(go, go.getPosition());
            delete this.gos[go.getId()];
        };
        Level.prototype.move = function (go, position) {
            if (this.layer.blocked(position.toString())) {
                return false;
            }
            this.layer.remove(go, go.getPosition());
            go.setPosition(position);
            this.layer.add(go, go.getPosition());
            return true;
        };
        Level.prototype.pickUpByPlayer = function (go, player) {
            player.addToInventory(go);
            this.remove(go);
        };
        Level.prototype.dropByPlayer = function (go, player) {
            player.removeFromInventory(go);
            go.setPosition(player.getPosition().copy());
            this.add(go);
        };
        Level.prototype.getTopGroundObject = function (position) {
            return this.layer.getTopWalkableGameObject(position);
        };
        Level.prototype.getTopItem = function (position) {
            return this.layer.getTopPickupableGameObject(position);
        };
        Level.prototype.getGameObjectLayer = function () {
            return this.layer;
        };
        return Level;
    })();
    Herbs.Level = Level;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=Level.js.map