/**
 * Created by michelcarroll on 15-04-03.
 */
/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./PlayerCommand.ts" />
/// <reference path="./UIAdapter.ts" />
/// <reference path="./Player.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./GameObjectRepository.ts" />
/// <reference path="./DisplayAdapter.ts" />
var Herbs;
(function (Herbs) {
    var Commander = (function () {
        function Commander(uiAdapter, socket, player, goRepository, map, displayAdapter) {
            this.uiAdapter = uiAdapter;
            this.socket = socket;
            this.player = player;
            this.goRepository = goRepository;
            this.displayAdapter = displayAdapter;
            this.map = map;
        }
        Commander.prototype.inputChat = function (text) {
            var self = this;
            var chatCommand = new Herbs.PlayerCommand(1, function () {
                self.uiAdapter.logOnUI("You shout \"" + text + "\"!!");
                self.socket.emit('shout', {
                    'text': text
                });
                return true;
            });
            this.executeCommand(chatCommand);
        };
        Commander.prototype.clickItem = function (goId) {
            var command = new Herbs.PlayerCommand(1, this.getDropCommand(goId));
            this.executeCommand(command);
        };
        Commander.prototype.pressKey = function (keyCode) {
            var command = this.getKeyCommandMap()[keyCode];
            if (command) {
                this.executeCommand(command);
            }
        };
        Commander.prototype.getMoveCommand = function (x, y) {
            var self = this;
            return function () {
                var coord = self.player.getPosition().add(x, y);
                if (!self.map.tileExists(coord)) {
                    return false;
                }
                if (!self.goRepository.move(self.player, coord)) {
                    return false;
                }
                self.socket.emit('being-moved', {
                    'id': self.player.getId(),
                    'x': self.player.getPosition().x,
                    'y': self.player.getPosition().y
                });
                return true;
            };
        };
        Commander.prototype.getLookAtFloorCommand = function () {
            var self = this;
            return function () {
                var go = self.goRepository.getTopGroundObject(self.player.getPosition());
                if (!go) {
                    return false;
                }
                self.uiAdapter.logOnUI("You see " + go.getDescription() + ".");
                self.socket.emit('being-looked-at-floor', {
                    'id': self.player.getId()
                });
                return true;
            };
        };
        Commander.prototype.getDropCommand = function (goId) {
            var self = this;
            return function () {
                var go = self.player.getInventory()[goId];
                if (!go) {
                    return false;
                }
                self.goRepository.dropByPlayer(go, self.player);
                self.uiAdapter.logOnUI("You drop the " + go.getName() + ".");
                self.uiAdapter.removeItemFromUI(go.getId());
                self.socket.emit('being-dropped', {
                    'playerId': self.player.getId(),
                    'objectId': go.getId()
                });
                return true;
            };
        };
        Commander.prototype.getPickUpCommand = function () {
            var self = this;
            return function () {
                var go = self.goRepository.getTopItem(self.player.getPosition());
                if (!go) {
                    return false;
                }
                self.goRepository.pickUpByPlayer(go, self.player);
                self.uiAdapter.logOnUI("You pick up the " + go.getName() + ".");
                self.uiAdapter.addItemToUI(go.getId(), go.getName());
                self.socket.emit('being-picked-up', {
                    'playerId': self.player.getId(),
                    'objectId': go.getId()
                });
                return true;
            };
        };
        Commander.prototype.getKeyCommandMap = function () {
            var map = {};
            map[ROT.VK_UP] = new Herbs.PlayerCommand(1, this.getMoveCommand(0, -1));
            map[ROT.VK_RIGHT] = new Herbs.PlayerCommand(1, this.getMoveCommand(1, 0));
            map[ROT.VK_DOWN] = new Herbs.PlayerCommand(1, this.getMoveCommand(0, 1));
            map[ROT.VK_LEFT] = new Herbs.PlayerCommand(1, this.getMoveCommand(-1, 0));
            map[ROT.VK_PERIOD] = new Herbs.PlayerCommand(1, this.getLookAtFloorCommand());
            map[ROT.VK_K] = new Herbs.PlayerCommand(1, this.getPickUpCommand());
            return map;
        };
        Commander.prototype.executeCommand = function (playerCommand) {
            if (!this.player.getRemainingActionTurns()) {
                this.uiAdapter.logOnUI("It's not your turn!");
                return;
            }
            else if (this.player.getRemainingActionTurns() - playerCommand.getTurnCost() < 0) {
                this.uiAdapter.logOnUI("You don't have enough turns to do this!");
                return;
            }
            if (!playerCommand.execute()) {
                this.uiAdapter.logOnUI("You can't do that!");
                return;
            }
            this.player.useTurns(playerCommand.getTurnCost());
            if (this.player.getRemainingActionTurns() > 0) {
                this.uiAdapter.logOnUI("You have " + this.player.getRemainingActionTurns() + " actions left.");
            }
            else {
                this.uiAdapter.logOnUI("Your turn is over.");
            }
            this.displayAdapter.draw();
        };
        return Commander;
    })();
    Herbs.Commander = Commander;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=Commander.js.map