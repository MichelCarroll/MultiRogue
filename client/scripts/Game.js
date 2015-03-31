/**
 * Created by michelcarroll on 15-03-22.
 */
/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./GameObject.ts" />
/// <reference path="./GameObjectRepository.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./PlayerCommand.ts" />
/// <reference path="./UIAdapter.ts" />
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
            this.socketIo = io;
            this.levelInitiated = false;
            this.initiateSocket();
            this.hookSocketEvents();
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
            });
            this.socket.on('initiate-board', function (data) {
                self.initializeGame();
                self.map.setTileMap(data.map);
                self.mapWidth = parseInt(data.width);
                self.mapHeight = parseInt(data.height);
                self.createGameObjects(data.gameObjects);
                self.socket.emit('position-my-player', {});
                self.uiAdapter.clearGameDisplay();
                self.createGameDisplay();
                self.initiateFov();
                if (data.current_player_id) {
                    var being = self.beingRepository.get(parseInt(data.current_player_id));
                    self.uiAdapter.highlightPlayer(being.getId());
                }
            });
            this.socket.on('position-player', function (data) {
                self.player = Herbs.GameObject.fromSerialization(data.player);
                self.uiAdapter.logOnUI("You're now connected as Player #" + self.player.getId() + "!", Herbs.CHAT_LOG_INFO);
                self.beingRepository.add(self.player);
                self.uiAdapter.addPlayerToUI(self.player.getId());
                self.levelInitiated = true;
                self.draw();
            });
            this.socket.on('being-moved', function (data) {
                var being = self.beingRepository.get(parseInt(data.id));
                if (!being) {
                    self.beingRepository.add(Herbs.GameObject.fromSerialization(data));
                }
                else {
                    self.beingRepository.move(being, new Herbs.Coordinate(parseInt(data.x), parseInt(data.y)));
                }
                self.draw();
            });
            this.socket.on('being-came', function (data) {
                var being = Herbs.GameObject.fromSerialization(data);
                self.beingRepository.add(being);
                self.draw();
                self.uiAdapter.logOnUI("Player #" + data.id + " just connected", Herbs.CHAT_LOG_INFO);
                self.uiAdapter.addPlayerToUI(being.getId());
            });
            this.socket.on('being-left', function (data) {
                self.beingRepository.remove(parseInt(data.id));
                self.draw();
                self.uiAdapter.logOnUI("Player #" + data.id + " just disconnected", Herbs.CHAT_LOG_INFO);
                self.uiAdapter.removePlayerFromUI(parseInt(data.id));
            });
            this.socket.on('its-another-player-turn', function (data) {
                var being = self.beingRepository.get(parseInt(data.id));
                self.uiAdapter.highlightPlayer(being.getId());
                self.uiAdapter.logOnUI("It's Player #" + being.getId() + "'s turn.");
            });
            this.socket.on('its-your-turn', function (msg) {
                self.actionTurns = parseInt(msg.turns);
                self.uiAdapter.highlightPlayer(self.player.getId());
                self.uiAdapter.logOnUI("It's your turn. You have " + self.actionTurns + " actions left.", Herbs.CHAT_LOG_SUCCESS);
            });
            this.socket.on('being-shouted', function (data) {
                self.uiAdapter.logOnUI("Player #" + data.id + " shouts \"" + data.text + "\"!!", Herbs.CHAT_LOG_INFO);
            });
            this.socket.on('disconnect', function (data) {
                self.uiAdapter.logOnUI("Disconnected from server", Herbs.CHAT_LOG_WARNING);
                self.uiAdapter.clearGameDisplay();
                self.levelInitiated = false;
            });
        };
        Game.prototype.initializeGame = function () {
            this.uiAdapter.clearPlayerList();
            this.actionTurns = 0;
            this.map = new Herbs.Board();
            this.beingRepository = new Herbs.GameObjectRepository();
        };
        Game.prototype.createGameObjects = function (serializedGameObjects) {
            for (var i in serializedGameObjects) {
                if (serializedGameObjects.hasOwnProperty(i)) {
                    var being = Herbs.GameObject.fromSerialization(serializedGameObjects[i]);
                    this.beingRepository.add(being);
                    this.uiAdapter.addPlayerToUI(being.getId());
                }
            }
        };
        Game.prototype.handleScreenResize = function () {
            this.uiAdapter.clearGameDisplay();
            this.createGameDisplay();
            this.draw();
        };
        Game.prototype.createGameDisplay = function () {
            this.display = new ROT.Display({
                width: this.mapWidth,
                height: this.mapHeight,
                fontSize: this.uiAdapter.getBestFontSize(this.mapWidth, this.mapHeight)
            });
            this.uiAdapter.setGameCanvas(this.display.getContainer());
        };
        Game.prototype.draw = function () {
            this.display.clear();
            if (!this.levelInitiated) {
                return;
            }
            this.drawBoard();
            this.drawPlayer();
        };
        Game.prototype.drawPlayer = function () {
            this.display.draw(this.player.getPosition().x, this.player.getPosition().y, this.player.getToken(), this.player.getColor(), "#aa0");
        };
        Game.prototype.drawBoard = function () {
            var self = this;
            this.fov.compute(this.player.getPosition().x, this.player.getPosition().y, 5, function (x, y, r, visibility) {
                if (!r) {
                    return;
                }
                var coord = new Herbs.Coordinate(x, y);
                var color = (self.map.tileExists(coord) ? "#aa0" : "#660");
                self.display.draw(x, y, self.map.getTile(coord), "#fff", color);
                var being = self.beingRepository.getTopGameObjectOnStack(coord);
                if (being) {
                    self.display.draw(being.getPosition().x, being.getPosition().y, being.getToken(), being.getColor(), "#aa0");
                }
            });
        };
        Game.prototype.initiateFov = function () {
            var self = this;
            this.fov = new ROT.FOV.PreciseShadowcasting(function (x, y) {
                if (self.map.tileExists(new Herbs.Coordinate(x, y))) {
                    return true;
                }
                return false;
            });
        };
        Game.prototype.getMoveCommand = function (x, y, player, beingRepository, map, socket) {
            return function () {
                var coord = player.getPosition().add(x, y);
                if (!map.tileExists(coord)) {
                    return false;
                }
                if (!beingRepository.move(player, coord)) {
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
        Game.prototype.getKeyCommandMap = function () {
            var map = {};
            map[ROT.VK_UP] = new Herbs.PlayerCommand(1, this.getMoveCommand(0, -1, this.player, this.beingRepository, this.map, this.socket));
            map[ROT.VK_RIGHT] = new Herbs.PlayerCommand(1, this.getMoveCommand(1, 0, this.player, this.beingRepository, this.map, this.socket));
            map[ROT.VK_DOWN] = new Herbs.PlayerCommand(1, this.getMoveCommand(0, 1, this.player, this.beingRepository, this.map, this.socket));
            map[ROT.VK_LEFT] = new Herbs.PlayerCommand(1, this.getMoveCommand(-1, 0, this.player, this.beingRepository, this.map, this.socket));
            return map;
        };
        Game.prototype.handlePlayerKeyEvent = function (keyCode) {
            var command = this.getKeyCommandMap()[keyCode];
            if (command) {
                this.executeCommand(command);
            }
        };
        Game.prototype.executeCommand = function (playerCommand) {
            if (this.actionTurns == 0) {
                this.uiAdapter.logOnUI("It's not your turn!");
                return;
            }
            else if (this.actionTurns - playerCommand.getTurnCost() < 0) {
                this.uiAdapter.logOnUI("You don't have enough turns to do this!");
                return;
            }
            if (!playerCommand.execute()) {
                this.uiAdapter.logOnUI("You can't do that!");
                return;
            }
            this.actionTurns -= playerCommand.getTurnCost();
            if (this.actionTurns > 0) {
                this.uiAdapter.logOnUI("You have " + this.actionTurns + " actions left.");
            }
            else {
                this.uiAdapter.logOnUI("Your turn is over.");
            }
            this.draw();
        };
        return Game;
    })();
    Herbs.Game = Game;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=Game.js.map