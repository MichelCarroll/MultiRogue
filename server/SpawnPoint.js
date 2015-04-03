/**
 * Created by michelcarroll on 15-03-29.
 */
///<reference path='./ts-definitions/node.d.ts' />
///<reference path='./bower_components/rot.js-TS/rot.d.ts' />
var fs = require('fs');
eval(fs.readFileSync(__dirname + '/node_modules/rot.js/rot.js/rot.js', 'utf8'));
var Coordinate = require('./Coordinate');
var SpawnPoint = (function () {
    function SpawnPoint(point, radius) {
        this.point = point;
        this.radius = radius;
    }
    SpawnPoint.prototype.generate = function (isValidPoint, maxTries) {
        var tries = 0;
        do {
            tries++;
            var r = ROT.RNG.getUniform() * Math.PI * 2;
            var d = ROT.RNG.getNormal(this.radius, 1);
            var randomAroundOrigin = new Coordinate(Math.floor(Math.cos(r) * d), Math.floor(Math.sin(r) * d));
            var possibleLocation = Coordinate.add(randomAroundOrigin, this.point);
        } while (!isValidPoint(possibleLocation) && tries < maxTries);
        return possibleLocation;
    };
    return SpawnPoint;
})();
module.exports = SpawnPoint;
//# sourceMappingURL=SpawnPoint.js.map