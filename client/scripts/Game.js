/**
 * Created by michelcarroll on 15-03-22.
 */
/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./GameObject.ts" />
/// <reference path="./GameObjectRepository.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./PlayerCommand.ts" />
/// <reference path="./UIAdapter.ts" />
/// <reference path="./DisplayAdapter.ts" />
/// <reference path="./Player.ts" />
var Herbs;
(function (Herbs) {
    Herbs.CHAT_LOG_SUCCESS = 'success';
    Herbs.CHAT_LOG_WARNING = 'warning';
    Herbs.CHAT_LOG_INFO = 'info';
    Herbs.CHAT_LOG_DANGER = 'danger';
    var Game = (function () {
        function Game() {
        }
        Game.prototype.init = function (io, uiAdapter) {
            this.uiAdapter = uiAdapter;
            this.displayAdapter = new Herbs.DisplayAdapter(this.uiAdapter);
            this.socketIo = io;
            this.initiateSocket();
            this.hookSocketEvents();
        };
        Game.prototype.initiateSocket = function () {
            var url = '';
            if (document.location.protocol === 'file:') {
                url = 'http://localhost';
            }
            else {
                url = 'http://' + document.location.hostname;
            }
            this.socket = this.socketIo.connect(url + ':3000');
        };
        Game.prototype.hookSocketEvents = function () {
            var self = this;
            this.socket.on('debug', function (msg) {
                console.log(msg);
                self.uiAdapter.logOnUI("Server Error " + msg, Herbs.CHAT_LOG_DANGER);
            });
            this.socket.on('initiate-board', function (data) {
                self.uiAdapter.clearPlayerList();
                self.map = new Herbs.Board(data.map, parseInt(data.width), parseInt(data.height));
                self.goRepository = new Herbs.GameObjectRepository();
                self.createGameObjects(data.gameObjects);
                if (data.current_player_id) {
                    var being = self.goRepository.get(parseInt(data.current_player_id));
                    self.uiAdapter.highlightPlayer(being.getId());
                }
                self.socket.emit('position-my-player', {});
            });
            this.socket.on('position-player', function (data) {
                self.player = Herbs.Player.fromSerialization(data.player);
                self.uiAdapter.logOnUI("You're now connected as " + self.player.getName() + "!", Herbs.CHAT_LOG_INFO);
                self.goRepository.add(self.player);
                self.uiAdapter.addPlayerToUI(self.player.getId(), self.player.getName());
                self.displayAdapter.reinitialize(self.map, self.player, self.goRepository);
            });
            this.socket.on('being-moved', function (data) {
                var being = self.goRepository.get(parseInt(data.id));
                if (!being) {
                    self.goRepository.add(Herbs.GameObject.fromSerialization(data));
                }
                else {
                    self.goRepository.move(being, new Herbs.Coordinate(parseInt(data.x), parseInt(data.y)));
                }
                self.displayAdapter.draw();
            });
            this.socket.on('being-came', function (data) {
                var being = Herbs.GameObject.fromSerialization(data);
                self.goRepository.add(being);
                self.displayAdapter.draw();
                if (being.isPlayer()) {
                    self.uiAdapter.logOnUI(being.getName() + " just connected", Herbs.CHAT_LOG_INFO);
                    self.uiAdapter.addPlayerToUI(being.getId(), being.getName());
                }
            });
            this.socket.on('being-left', function (data) {
                var being = self.goRepository.get(parseInt(data.id));
                if (!being) {
                    return;
                }
                self.goRepository.remove(being);
                self.displayAdapter.draw();
                if (being.isPlayer()) {
                    self.uiAdapter.logOnUI(being.getName() + " just disconnected", Herbs.CHAT_LOG_INFO);
                    self.uiAdapter.removePlayerFromUI(parseInt(data.id));
                }
            });
            this.socket.on('its-another-player-turn', function (data) {
                var being = self.goRepository.get(parseInt(data.id));
                if (!being) {
                    return;
                }
                self.uiAdapter.highlightPlayer(being.getId());
                self.uiAdapter.logOnUI("It's " + being.getName() + "'s turn.");
            });
            this.socket.on('its-your-turn', function (msg) {
                self.player.giveTurns(parseInt(msg.turns));
                self.uiAdapter.highlightPlayer(self.player.getId());
                self.uiAdapter.logOnUI("It's your turn. You have " + self.player.getRemainingActionTurns() + " actions left.", Herbs.CHAT_LOG_SUCCESS);
            });
            this.socket.on('being-shouted', function (data) {
                var being = self.goRepository.get(parseInt(data.id));
                if (!being) {
                    return;
                }
                self.uiAdapter.logOnUI(being.getName() + " shouts \"" + data.text + "\"!!", Herbs.CHAT_LOG_INFO);
            });
            this.socket.on('disconnect', function (data) {
                self.uiAdapter.logOnUI("Disconnected from server", Herbs.CHAT_LOG_WARNING);
                self.displayAdapter.clear();
            });
            this.socket.on('being-looked-at-floor', function (data) {
                var being = self.goRepository.get(parseInt(data.id));
                if (!being) {
                    return;
                }
                self.uiAdapter.logOnUI(being.getName() + " inspected an object on the floor.", Herbs.CHAT_LOG_INFO);
            });
            this.socket.on('game-object-remove', function (data) {
                var go = self.goRepository.get(parseInt(data.id));
                if (!go) {
                    return;
                }
                self.goRepository.remove(go);
                self.displayAdapter.draw();
            });
            this.socket.on('game-object-add', function (data) {
                var go = Herbs.GameObject.fromSerialization(data);
                self.goRepository.add(go);
                self.displayAdapter.draw();
            });
        };
        Game.prototype.createGameObjects = function (serializedGameObjects) {
            for (var i in serializedGameObjects) {
                if (serializedGameObjects.hasOwnProperty(i)) {
                    var being = Herbs.GameObject.fromSerialization(serializedGameObjects[i]);
                    this.goRepository.add(being);
                    if (being.isPlayer()) {
                        this.uiAdapter.addPlayerToUI(being.getId(), being.getName());
                    }
                }
            }
        };
        Game.prototype.handleInputChat = function (text) {
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
        Game.prototype.handleScreenResize = function () {
            this.displayAdapter.resize();
        };
        Game.prototype.getMoveCommand = function (x, y, player, goRepository, map, socket) {
            return function () {
                var coord = player.getPosition().add(x, y);
                if (!map.tileExists(coord)) {
                    return false;
                }
                if (!goRepository.move(player, coord)) {
                    return false;
                }
                socket.emit('being-moved', {
                    'id': player.getId(),
                    'x': player.getPosition().x,
                    'y': player.getPosition().y
                });
                return true;
            };
        };
        Game.prototype.getLookAtFloorCommand = function (player, goRepository, socket) {
            var self = this;
            return function () {
                var go = goRepository.getTopWalkableGameObjectOnStack(player.getPosition());
                if (!go) {
                    return false;
                }
                self.uiAdapter.logOnUI("You see " + go.getDescription() + ".");
                socket.emit('being-looked-at-floor', {
                    'id': player.getId()
                });
                return true;
            };
        };
        Game.prototype.getDropCommand = function (goId, player, goRepository, socket) {
            var self = this;
            return function () {
                var go = player.getInventory()[goId];
                if (!go) {
                    return false;
                }
                goRepository.dropByPlayer(go, player);
                self.uiAdapter.logOnUI("You drop the " + go.getName() + ".");
                self.uiAdapter.removeItemFromUI(go.getId());
                socket.emit('being-dropped', {
                    'playerId': player.getId(),
                    'objectId': go.getId()
                });
                return true;
            };
        };
        Game.prototype.getPickUpCommand = function (player, goRepository, socket) {
            var self = this;
            return function () {
                var go = goRepository.getTopPickupableGameObjectOnStack(player.getPosition());
                if (!go) {
                    return false;
                }
                goRepository.pickUpByPlayer(go, player);
                self.uiAdapter.logOnUI("You pick up the " + go.getName() + ".");
                self.uiAdapter.addItemToUI(go.getId(), go.getName());
                socket.emit('being-picked-up', {
                    'playerId': player.getId(),
                    'objectId': go.getId()
                });
                return true;
            };
        };
        Game.prototype.getKeyCommandMap = function () {
            var map = {};
            map[ROT.VK_UP] = new Herbs.PlayerCommand(1, this.getMoveCommand(0, -1, this.player, this.goRepository, this.map, this.socket));
            map[ROT.VK_RIGHT] = new Herbs.PlayerCommand(1, this.getMoveCommand(1, 0, this.player, this.goRepository, this.map, this.socket));
            map[ROT.VK_DOWN] = new Herbs.PlayerCommand(1, this.getMoveCommand(0, 1, this.player, this.goRepository, this.map, this.socket));
            map[ROT.VK_LEFT] = new Herbs.PlayerCommand(1, this.getMoveCommand(-1, 0, this.player, this.goRepository, this.map, this.socket));
            map[ROT.VK_PERIOD] = new Herbs.PlayerCommand(1, this.getLookAtFloorCommand(this.player, this.goRepository, this.socket));
            map[ROT.VK_K] = new Herbs.PlayerCommand(1, this.getPickUpCommand(this.player, this.goRepository, this.socket));
            return map;
        };
        Game.prototype.handleItemClickEvent = function (goId) {
            var command = new Herbs.PlayerCommand(1, this.getDropCommand(goId, this.player, this.goRepository, this.socket));
            this.executeCommand(command);
        };
        Game.prototype.handlePlayerKeyEvent = function (keyCode) {
            var command = this.getKeyCommandMap()[keyCode];
            if (command) {
                this.executeCommand(command);
            }
        };
        Game.prototype.executeCommand = function (playerCommand) {
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
        return Game;
    })();
    Herbs.Game = Game;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=Game.js.map