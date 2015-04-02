/**
 * Created by michelcarroll on 15-03-31.
 */
/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./Player.ts" />
/// <reference path="./GameObjectRepository.ts" />
/// <reference path="./UIAdapter.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./Coordinate.ts" />
var Herbs;
(function (Herbs) {
    var DisplayAdapter = (function () {
        function DisplayAdapter(uiAdapter) {
            this.uiAdapter = uiAdapter;
        }
        DisplayAdapter.prototype.reinitialize = function (map, player, goRepository) {
            this.map = map;
            this.player = player;
            this.goRepository = goRepository;
            this.recreateGameDisplay();
            this.initiateFov();
            this.draw();
        };
        DisplayAdapter.prototype.resize = function () {
            if (!this.map) {
                return;
            }
            this.recreateGameDisplay();
            this.draw();
        };
        DisplayAdapter.prototype.draw = function () {
            if (!this.map) {
                return;
            }
            this.display.clear();
            this.drawBoard();
            this.drawPlayer();
        };
        DisplayAdapter.prototype.clear = function () {
            this.uiAdapter.clearGameDisplay();
        };
        DisplayAdapter.prototype.drawPlayer = function () {
            this.display.draw(this.player.getPosition().x, this.player.getPosition().y, this.player.getToken(), this.player.getColor(), "#aa0");
        };
        DisplayAdapter.prototype.drawBoard = function () {
            var self = this;
            this.fov.compute(this.player.getPosition().x, this.player.getPosition().y, 5, function (x, y, r, visibility) {
                if (!r) {
                    return;
                }
                var coord = new Herbs.Coordinate(x, y);
                var color = (self.map.tileExists(coord) ? "#aa0" : "#660");
                self.display.draw(x, y, self.map.getTile(coord), "#fff", color);
                var being = self.goRepository.getTopGameObjectOnStack(coord);
                if (being) {
                    self.display.draw(being.getPosition().x, being.getPosition().y, being.getToken(), being.getColor(), "#aa0");
                }
            });
        };
        DisplayAdapter.prototype.initiateFov = function () {
            var self = this;
            this.fov = new ROT.FOV.PreciseShadowcasting(function (x, y) {
                if (self.map.tileExists(new Herbs.Coordinate(x, y))) {
                    return true;
                }
                return false;
            });
        };
        DisplayAdapter.prototype.recreateGameDisplay = function () {
            this.uiAdapter.clearGameDisplay();
            this.display = new ROT.Display({
                width: this.map.getWidth(),
                height: this.map.getHeight(),
                fontSize: this.uiAdapter.getBestFontSize(this.map.getWidth(), this.map.getHeight())
            });
            this.uiAdapter.setGameCanvas(this.display.getContainer());
        };
        return DisplayAdapter;
    })();
    Herbs.DisplayAdapter = DisplayAdapter;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=DisplayAdapter.js.map