/**
 * Created by michelcarroll on 15-03-29.
 */
var BeingRepository = (function () {
    function BeingRepository(board) {
        this.board = board;
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
        this.board.unoccupyTile(being.getX(), being.getY());
        delete this.beings[being.getId()];
    };
    BeingRepository.prototype.add = function (being) {
        this.beings[being.getId()] = being;
        this.board.occupyTile(being.getX(), being.getY());
    };
    BeingRepository.prototype.move = function (being, x, y) {
        this.board.unoccupyTile(being.getX(), being.getY());
        being.setX(x);
        being.setY(y);
        this.board.occupyTile(being.getX(), being.getY());
    };
    return BeingRepository;
})();
module.exports = BeingRepository;
//# sourceMappingURL=BeingRepository.js.map