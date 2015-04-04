/**
 * Created by michelcarroll on 15-03-29.
 */

///<reference path='./ts-definitions/node.d.ts' />
///<reference path='./bower_components/rot.js-TS/rot.d.ts' />

var fs = require('fs');
eval(fs.readFileSync(__dirname+'/node_modules/rot.js/rot.js/rot.js','utf8'));

import Coordinate = require('./Coordinate');
import Being = require('./Being');

class SpawnPoint {

    private static MAX_TRIES:number = 50;

    private radius:number;
    private point:Coordinate;
    private isValidPoint:(point:Coordinate) => boolean;

    constructor(point:Coordinate, radius:number,  isValidPoint:(point:Coordinate) => boolean) {
        this.point = point;
        this.radius = radius;
        this.isValidPoint = isValidPoint;
    }

    public generate() {
        var tries = 0;
        do {
            tries++;
            var r = ROT.RNG.getUniform() * Math.PI * 2;
            var d = ROT.RNG.getNormal(this.radius, 1);
            var randomAroundOrigin = new Coordinate(
                Math.floor(Math.cos(r) * d),
                Math.floor(Math.sin(r) * d)
            );
            var possibleLocation = Coordinate.add(
                randomAroundOrigin,
                this.point
            );

        } while(!this.isValidPoint(possibleLocation) && tries < SpawnPoint.MAX_TRIES);

        return possibleLocation;
    }

}

export = SpawnPoint;