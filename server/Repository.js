/**
 * Created by michelcarroll on 15-03-29.
 */
var Repository = (function () {
    function Repository() {
        this.objects = {};
    }
    Repository.prototype.get = function (key) {
        return this.objects[key];
    };
    Repository.prototype.serialize = function () {
        var self = this;
        return Object.getOwnPropertyNames(this.objects).map(function (key) {
            return self.objects[key].serialize();
        });
    };
    Repository.prototype.delete = function (key) {
        delete this.objects[key];
    };
    Repository.prototype.set = function (key, val) {
        this.objects[key] = val;
    };
    Repository.prototype.getAll = function () {
        var self = this;
        return Object.getOwnPropertyNames(this.objects).map(function (key) {
            return self.objects[key];
        });
    };
    return Repository;
})();
module.exports = Repository;
//# sourceMappingURL=Repository.js.map