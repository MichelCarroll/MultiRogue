/**
 * Created by michelcarroll on 15-03-29.
 */
var GameObjectRepository = (function () {
    function GameObjectRepository() {
        this.objects = {};
    }
    GameObjectRepository.prototype.get = function (id) {
        return this.objects[id];
    };
    GameObjectRepository.prototype.serialize = function () {
        var beingSerialized = new Array();
        for (var index in this.objects) {
            var being = this.objects[index];
            beingSerialized.push(being.serialize());
        }
        return beingSerialized;
    };
    GameObjectRepository.prototype.delete = function (gameObject) {
        delete this.objects[gameObject.getId()];
    };
    GameObjectRepository.prototype.add = function (gameObject) {
        this.objects[gameObject.getId()] = gameObject;
    };
    GameObjectRepository.prototype.getAll = function () {
        var self = this;
        return Object.getOwnPropertyNames(this.objects).map(function (key) {
            return self.objects[key];
        });
    };
    return GameObjectRepository;
})();
module.exports = GameObjectRepository;
//# sourceMappingURL=GameObjectRepository.js.map