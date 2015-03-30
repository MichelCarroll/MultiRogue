/**
 * Created by michelcarroll on 15-03-27.
 */
/// <reference path="./GameObject.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./Coordinate.ts" />
var Herbs;
(function (Herbs) {
    var GameObjectRepository = (function () {
        function GameObjectRepository(goBoard) {
            this.goBoard = goBoard;
            this.gos = {};
        }
        GameObjectRepository.prototype.add = function (go) {
            this.gos[go.getId()] = go;
            this.goBoard.setTile(go.getPosition(), go);
        };
        GameObjectRepository.prototype.get = function (id) {
            return this.gos[id];
        };
        GameObjectRepository.prototype.remove = function (id) {
            var go = this.gos[id];
            if (go) {
                if (this.goBoard.getTile(go.getPosition()) === go) {
                    this.goBoard.deleteTile(go.getPosition());
                }
                delete this.gos[id];
            }
        };
        GameObjectRepository.prototype.move = function (go, position) {
            var foundGo = this.goBoard.getTile(position);
            if (foundGo && !foundGo.canBeWalkedThrough()) {
                return false;
            }
            this.goBoard.deleteTile(go.getPosition());
            go.setPosition(position);
            this.goBoard.setTile(position, go);
            return true;
        };
        return GameObjectRepository;
    })();
    Herbs.GameObjectRepository = GameObjectRepository;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=GameObjectRepository.js.map