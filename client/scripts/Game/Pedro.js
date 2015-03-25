/**
 * Created by michelcarroll on 15-03-22.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./Being.ts" />
var Pedro = (function (_super) {
    __extends(Pedro, _super);
    function Pedro() {
        _super.apply(this, arguments);
    }
    Pedro.prototype.getColor = function () {
        return '#F00';
    };
    return Pedro;
})(Being);
//# sourceMappingURL=Pedro.js.map