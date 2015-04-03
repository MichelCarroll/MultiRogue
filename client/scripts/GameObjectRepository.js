/**
 * Created by michelcarroll on 15-03-27.
 */
/// <reference path="./GameObject.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./Coordinate.ts" />
/// <reference path="./GameObjectLayer.ts" />
var Herbs;
(function (Herbs) {
    var GameObjectRepository = (function () {
        function GameObjectRepository() {
            this.layer = new Herbs.GameObjectLayer();
            this.gos = {};
        }
        GameObjectRepository.prototype.add = function (go) {
            this.gos[go.getId()] = go;
            this.layer.add(go, go.getPosition());
        };
        GameObjectRepository.prototype.get = function (id) {
            if (!this.has(id)) {
                throw new Error('No GO with ID: ' + id);
            }
            return this.gos[id];
        };
        GameObjectRepository.prototype.has = function (id) {
            return this.gos.hasOwnProperty(id.toString());
        };
        GameObjectRepository.prototype.remove = function (go) {
            this.layer.remove(go, go.getPosition());
            delete this.gos[go.getId()];
        };
        GameObjectRepository.prototype.move = function (go, position) {
            if (this.layer.blocked(position.toString())) {
                return false;
            }
            this.layer.remove(go, go.getPosition());
            go.setPosition(position);
            this.layer.add(go, go.getPosition());
            return true;
        };
        GameObjectRepository.prototype.pickUpByPlayer = function (go, player) {
            player.addToInventory(go);
            this.remove(go);
        };
        GameObjectRepository.prototype.dropByPlayer = function (go, player) {
            player.removeFromInventory(go);
            go.setPosition(player.getPosition().copy());
            this.add(go);
        };
        GameObjectRepository.prototype.getTopGroundObject = function (position) {
            return this.layer.getTopWalkableGameObject(position);
        };
        GameObjectRepository.prototype.getTopItem = function (position) {
            return this.layer.getTopPickupableGameObject(position);
        };
        GameObjectRepository.prototype.getGameObjectLayer = function () {
            return this.layer;
        };
        return GameObjectRepository;
    })();
    Herbs.GameObjectRepository = GameObjectRepository;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=GameObjectRepository.js.map