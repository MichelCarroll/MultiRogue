/**
 * Created by michelcarroll on 15-03-29.
 */

var fs = require('fs');

import Vector2D = require('../common/Vector2D');
import Being = require('./Being');
import ROT = require('./ROT');

class SpawnPoint {

    private static MAX_TRIES:number = 50;

    private radius:number;
    private point:Vector2D;
    private isValidPoint:(point:Vector2D) => boolean;

    constructor(point:Vector2D, radius:number,  isValidPoint:(point:Vector2D) => boolean) {
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
            var randomAroundOrigin = new Vector2D(
                Math.floor(Math.cos(r) * d),
                Math.floor(Math.sin(r) * d)
            );
            var possibleLocation = Vector2D.add(
                randomAroundOrigin,
                this.point
            );

        } while(!this.isValidPoint(possibleLocation) && tries < SpawnPoint.MAX_TRIES);

        return possibleLocation;
    }

}

export = SpawnPoint;