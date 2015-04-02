/**
 * Created by michelcarroll on 15-03-22.
 */
/// <reference path="./Coordinate.ts" />
var Herbs;
(function (Herbs) {
    var GameObject = (function () {
        function GameObject(id) {
            this.id = id;
        }
        GameObject.prototype.setToken = function (token) {
            this.token = token;
        };
        GameObject.prototype.setColorHex = function (colorHex) {
            this.colorHex = colorHex;
        };
        GameObject.prototype.setPosition = function (position) {
            this.position = position;
        };
        GameObject.prototype.setDescription = function (description) {
            this.description = description;
        };
        GameObject.prototype.getDescription = function () {
            return this.description;
        };
        GameObject.prototype.getId = function () {
            return this.id;
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
        GameObject.prototype.setName = function (name) {
            this.name = name;
        };
        GameObject.prototype.getName = function () {
            return this.name;
        };
        GameObject.prototype.setIsPlayer = function (isAPLayer) {
            this.isAPLayer = isAPLayer;
        };
        GameObject.prototype.isPlayer = function () {
            return this.isAPLayer;
        };
        GameObject.prototype.setCanBePickedUp = function (value) {
            this.canPickUp = value;
        };
        GameObject.prototype.canBePickedUp = function () {
            return this.canPickUp;
        };
        GameObject.fromSerialization = function (data) {
            var go = new GameObject(parseInt(data.id));
            GameObject.assignSerializedData(go, data);
            return go;
        };
        GameObject.assignSerializedData = function (go, data) {
            go.setPosition(new Herbs.Coordinate(parseInt(data.x), parseInt(data.y)));
            go.setToken(data.token);
            go.setColorHex(data.color);
            go.setIsPlayer(data['isPlayer']);
            go.setName(data.name);
            go.setDescription(data.description);
            go.setCanBeWalkedThrough(data.canWalkOn);
            go.setCanBePickedUp(data.canPickUp);
        };
        return GameObject;
    })();
    Herbs.GameObject = GameObject;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=GameObject.js.map