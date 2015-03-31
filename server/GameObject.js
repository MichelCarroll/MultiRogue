/**
 * Created by michelcarroll on 15-03-29.
 */
///<reference path='./bower_components/rot.js-TS/rot.d.ts' />
var fs = require('fs');
eval(fs.readFileSync(__dirname + '/node_modules/rot.js/rot.js/rot.js', 'utf8'));
var GameObject = (function () {
    function GameObject(position, token, color, name, description) {
        this.position = position;
        this.id = GameObject.getNextId();
        this.token = token;
        this.colorHex = color;
        this.name = name;
        this.description = description;
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
    GameObject.prototype.setName = function (name) {
        this.name = name;
    };
    GameObject.prototype.getName = function () {
        return this.name;
    };
    GameObject.prototype.getDescription = function () {
        return this.description;
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
            'token': this.getToken(),
            'canWalkOn': this.canBeWalkedThrough(),
            'name': this.getName(),
            'is-player': false,
            'description': this.getDescription()
        };
    };
    GameObject.lastId = 1;
    return GameObject;
})();
module.exports = GameObject;
//# sourceMappingURL=GameObject.js.map