///<reference path='./ts-definitions/node.d.ts' />
///<reference path='./bower_components/rot.js-TS/rot.d.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var fs = require('fs');
eval(fs.readFileSync(__dirname + '/node_modules/rot.js/rot.js/rot.js', 'utf8'));
var GameObject = require('./GameObject');
var Item = (function (_super) {
    __extends(Item, _super);
    function Item(position, token, colorHex, name, description) {
        _super.call(this, position, token, colorHex, name, description);
    }
    Item.prototype.serialize = function () {
        var data = _super.prototype.serialize.call(this);
        data.canPickUp = true;
        return data;
    };
    return Item;
})(GameObject);
module.exports = Item;
//# sourceMappingURL=Item.js.map