/**
 * Created by michelcarroll on 15-03-22.
 */
/// <reference path="./Coordinate.ts" />
var Herbs;
(function (Herbs) {
    var GameObject = (function () {
        function GameObject(id, position, token, colorHex) {
            this.position = position;
            this.id = id;
            this.token = token;
            this.colorHex = colorHex;
        }
        GameObject.prototype.getId = function () {
            return this.id;
        };
        GameObject.prototype.setPosition = function (position) {
            this.position = position;
        };
        GameObject.prototype.getPosition = function () {
            return this.position;
        };
        GameObject.prototype.getToken = function () {
            return this.token;
        };
        GameObject.prototype.getColor = function () {
            return this.colorHex;
        };
        GameObject.prototype.setCanBeWalkedThrough = function (value) {
            this.canWalkOn = value;
        };
        GameObject.prototype.canBeWalkedThrough = function () {
            return this.canWalkOn;
        };
        GameObject.fromSerialization = function (data) {
            var go = new GameObject(parseInt(data.id), new Herbs.Coordinate(parseInt(data.x), parseInt(data.y)), data.token, data.color);
            go.setCanBeWalkedThrough(data.canWalkOn);
            return go;
        };
        return GameObject;
    })();
    Herbs.GameObject = GameObject;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=GameObject.js.map