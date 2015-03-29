/**
 * Created by michelcarroll on 15-03-29.
 */
var BeingRepository = (function () {
    function BeingRepository(beingBoard) {
        this.beingBoard = beingBoard;
        this.beings = {};
    }
    BeingRepository.prototype.get = function (id) {
        return this.beings[id];
    };
    BeingRepository.prototype.serialize = function () {
        var beingSerialized = new Array();
        for (var index in this.beings) {
            var being = this.beings[index];
            beingSerialized.push(being.serialize());
        }
        return beingSerialized;
    };
    BeingRepository.prototype.delete = function (being) {
        delete this.beings[being.getId()];
    };
    BeingRepository.prototype.add = function (being) {
        this.beings[being.getId()] = being;
    };
    return BeingRepository;
})();
module.exports = BeingRepository;
//# sourceMappingURL=BeingRepository.js.map