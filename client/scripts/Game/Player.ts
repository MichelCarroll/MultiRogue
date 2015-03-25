/**
 * Created by michelcarroll on 15-03-22.
 */

/// <reference path="../../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./Being.ts" />



class Player extends Being {

    public getToken():string {
        return '@';
    }

    public getColor():string {
        return '#FF0';
    }

}