/**
 * Created by michelcarroll on 15-03-29.
 */
///<reference path='./bower_components/rot.js-TS/rot.d.ts' />
var fs = require('fs');
eval(fs.readFileSync('./node_modules/rot.js/rot.js/rot.js', 'utf8'));
var GameObject = (function () {
    function GameObject(position, token, color) {
        this.position = position;
        this.id = GameObject.getNextId();
        this.token = token;
        this.colorHex = color;
    }
    GameObject.getNextId = function () {
        return this.lastId++;
    };
    GameObject.prototype.getId = function () {
        return this.id;
    };
    GameObject.prototype.getPosition = function () {
        return this.position;
    };
    GameObject.prototype.setPosition = function (position) {
        this.position = position;
    };
    GameObject.prototype.getToken = function () {
        return this.token;
    };
    GameObject.prototype.getColor = function () {
        return this.colorHex;
    };
    GameObject.prototype.canBeWalkedThrough = function () {
        return true;
    };
    GameObject.prototype.serialize = function () {
        return {
            'id': this.getId(),
            'x': this.position.x,
            'y': this.position.y,
            'color': this.getColor(),
            'token': this.getToken()
        };
    };
    GameObject.lastId = 1;
    return GameObject;
})();
module.exports = GameObject;
//# sourceMappingURL=GameObject.js.map