/**
 * Created by michelcarroll on 15-03-29.
 */
///<reference path='./ts-definitions/node.d.ts' />
var Being = require('./Being');
var BeingGenerator = (function () {
    function BeingGenerator(callForTurn) {
        this.callForTurn = callForTurn;
    }
    BeingGenerator.prototype.create = function () {
        return new Being(this.callForTurn);
    };
    return BeingGenerator;
})();
module.exports = BeingGenerator;
//# sourceMappingURL=BeingGenerator.js.map