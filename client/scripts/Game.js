/**
 * Created by michelcarroll on 15-03-22.
 */
/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./GameObject.ts" />
/// <reference path="./GameObjectRepository.ts" />
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
                self.commander = new Herbs.Commander(self.uiAdapter, self.socket, self.player, self.goRepository, self.map, self.displayAdapter);
                self.displayAdapter.reinitialize(self.map, self.player, self.goRepository.getGameObjectLayer());
            });
            this.socket.on('being-moved', function (data) {
                var being = self.goRepository.get(parseInt(data.id));
                self.goRepository.move(being, new Herbs.Coordinate(parseInt(data.x), parseInt(data.y)));
                self.displayAdapter.draw();
            });
            this.socket.on('player-came', function (data) {
                var being = Herbs.GameObject.fromSerialization(data);
                self.goRepository.add(being);
                self.displayAdapter.draw();
                self.uiAdapter.logOnUI(being.getName() + " just connected", Herbs.CHAT_LOG_INFO);
                self.uiAdapter.addPlayerToUI(being.getId(), being.getName());
            });
            this.socket.on('player-left', function (data) {
                var being = self.goRepository.get(parseInt(data.id));
                self.goRepository.remove(being);
                self.displayAdapter.draw();
                self.uiAdapter.logOnUI(being.getName() + " just disconnected", Herbs.CHAT_LOG_INFO);
                self.uiAdapter.removePlayerFromUI(parseInt(data.id));
            });
            this.socket.on('its-another-player-turn', function (data) {
                var being = self.goRepository.get(parseInt(data.id));
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
                self.uiAdapter.logOnUI(being.getName() + " shouts \"" + data.text + "\"!!", Herbs.CHAT_LOG_INFO);
            });
            this.socket.on('disconnect', function (data) {
                self.uiAdapter.logOnUI("Disconnected from server", Herbs.CHAT_LOG_WARNING);
                self.commander = null;
                self.displayAdapter.clear();
            });
            this.socket.on('being-looked-at-floor', function (data) {
                var being = self.goRepository.get(parseInt(data.id));
                self.uiAdapter.logOnUI(being.getName() + " inspected an object on the floor.", Herbs.CHAT_LOG_INFO);
            });
            this.socket.on('game-object-remove', function (data) {
                var go = self.goRepository.get(parseInt(data.id));
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