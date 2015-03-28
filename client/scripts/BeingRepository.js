/**
 * Created by michelcarroll on 15-03-27.
 */
/// <reference path="./Being.ts" />
/// <reference path="./Map.ts" />
var Herbs;
(function (Herbs) {
    var BeingRepository = (function () {
        function BeingRepository(beingMap) {
            this.beingMap = beingMap;
            this.beings = {};
        }
        BeingRepository.prototype.add = function (being) {
            this.beings[being.getId()] = being;
            this.beingMap.setTile(being.getX(), being.getY(), being);
        };
        BeingRepository.prototype.get = function (id) {
            return this.beings[id];
        };
        BeingRepository.prototype.remove = function (id) {
            var being = this.beings[id];
            if (being) {
                if (this.beingMap.getTile(being.getX(), being.getY()) === being) {
                    this.beingMap.deleteTile(being.getX(), being.getY());
                }
                delete this.beings[id];
            }
        };
        BeingRepository.prototype.move = function (being, x, y) {
            this.beingMap.deleteTile(being.getX(), being.getY());
            being.setX(x);
            being.setY(y);
            this.beingMap.setTile(being.getX(), being.getY(), being);
        };
        return BeingRepository;
    })();
    Herbs.BeingRepository = BeingRepository;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=BeingRepository.js.map