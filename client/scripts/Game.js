/**
 * Created by michelcarroll on 15-03-22.
 */
/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./GameObject.ts" />
/// <reference path="./Level.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./UIAdapter.ts" />
/// <reference path="./DisplayAdapter.ts" />
/// <reference path="./Player.ts" />
/// <reference path="./Commander.ts" />
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
            this.hookSocketEvents(this.getSocket(io));
        };
        Game.prototype.getSocket = function (io) {
            var url = '';
            if (document.location.protocol === 'file:') {
                url = 'http://localhost';
            }
            else {
                url = 'http://' + document.location.hostname;
            }
            return io.connect(url + ':3000');
        };
        Game.prototype.hookSocketEvents = function (socket) {
            var self = this;
            socket.on('initiate', function (data) {
                self.uiAdapter.clearPlayerList();
                self.level = new Herbs.Level();
                self.createGameObjects(data.level.gameObjects);
                if (data.level.current_player_id) {
                    var being = self.level.get(parseInt(data.level.current_player_id));
                    self.uiAdapter.highlightPlayer(being.getId());
                }
                self.player = Herbs.Player.fromSerialization(data.player);
                self.uiAdapter.logOnUI("You're now connected as " + self.player.getName() + "!", Herbs.CHAT_LOG_INFO);
                var map = new Herbs.Board(data.level.map, parseInt(data.level.width), parseInt(data.level.height));
                self.commander = new Herbs.Commander(self.uiAdapter, socket, self.player, self.level, map, self.displayAdapter);
                self.displayAdapter.reinitialize(map, self.player, self.level.getGameObjectLayer());
            });
            socket.on('being-moved', function (data) {
                var being = self.level.get(parseInt(data.id));
                self.level.move(being, new Herbs.Coordinate(parseInt(data.x), parseInt(data.y)));
                self.displayAdapter.draw();
            });
            socket.on('player-came', function (data) {
                var being = Herbs.GameObject.fromSerialization(data);
                self.level.add(being);
                self.displayAdapter.draw();
                self.uiAdapter.logOnUI(being.getName() + " just connected", Herbs.CHAT_LOG_INFO);
                self.uiAdapter.addPlayerToUI(being.getId(), being.getName());
            });
            socket.on('player-left', function (data) {
                var being = self.level.get(parseInt(data.id));
                self.level.remove(being);
                self.displayAdapter.draw();
                self.uiAdapter.logOnUI(being.getName() + " just disconnected", Herbs.CHAT_LOG_INFO);
                self.uiAdapter.removePlayerFromUI(parseInt(data.id));
            });
            socket.on('its-another-player-turn', function (data) {
                var being = self.level.get(parseInt(data.id));
                self.uiAdapter.highlightPlayer(being.getId());
                self.uiAdapter.logOnUI("It's " + being.getName() + "'s turn.");
            });
            socket.on('its-your-turn', function (msg) {
                self.player.giveTurns(parseInt(msg.turns));
                self.uiAdapter.highlightPlayer(self.player.getId());
                self.uiAdapter.logOnUI("It's your turn. You have " + self.player.getRemainingActionTurns() + " actions left.", Herbs.CHAT_LOG_SUCCESS);
            });
            socket.on('being-shouted', function (data) {
                var being = self.level.get(parseInt(data.id));
                self.uiAdapter.logOnUI(being.getName() + " shouts \"" + data.text + "\"!!", Herbs.CHAT_LOG_INFO);
            });
            socket.on('disconnect', function (data) {
                self.uiAdapter.logOnUI("Disconnected from server", Herbs.CHAT_LOG_WARNING);
                self.commander = null;
                self.displayAdapter.clear();
            });
            socket.on('being-looked-at-floor', function (data) {
                var being = self.level.get(parseInt(data.id));
                self.uiAdapter.logOnUI(being.getName() + " inspected an object on the floor.", Herbs.CHAT_LOG_INFO);
            });
            socket.on('game-object-remove', function (data) {
                var go = self.level.get(parseInt(data.id));
                self.level.remove(go);
                self.displayAdapter.draw();
            });
            socket.on('game-object-add', function (data) {
                var go = Herbs.GameObject.fromSerialization(data);
                self.level.add(go);
                self.displayAdapter.draw();
            });
            socket.on('debug', function (msg) {
                console.log(msg);
                self.uiAdapter.logOnUI("Server Error " + msg, Herbs.CHAT_LOG_DANGER);
            });
        };
        Game.prototype.createGameObjects = function (serializedGameObjects) {
            for (var i in serializedGameObjects) {
                if (serializedGameObjects.hasOwnProperty(i)) {
                    var being = Herbs.GameObject.fromSerialization(serializedGameObjects[i]);
                    this.level.add(being);
                    if (being.isPlayer()) {
                        this.uiAdapter.addPlayerToUI(being.getId(), being.getName());
                    }
                }
            }
        };
        Game.prototype.handleScreenResize = function () {
            this.displayAdapter.resize();
        };
        Game.prototype.handleInputChat = function (text) {
            if (!this.commander) {
                return;
            }
            this.commander.inputChat(text);
        };
        Game.prototype.handleItemClickEvent = function (goId) {
            if (!this.commander) {
                return;
            }
            this.commander.clickItem(goId);
        };
        Game.prototype.handlePlayerKeyEvent = function (keyCode) {
            if (!this.commander) {
                return;
            }
            this.commander.pressKey(keyCode);
        };
        return Game;
    })();
    Herbs.Game = Game;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=Game.js.map