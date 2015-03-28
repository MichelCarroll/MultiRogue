/**
 * Created by michelcarroll on 15-03-22.
 */
/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./Being.ts" />
/// <reference path="./BeingRepository.ts" />
/// <reference path="./Map.ts" />
/// <reference path="./PlayerCommand.ts" />
var Herbs;
(function (Herbs) {
    var Game = (function () {
        function Game() {
        }
        Game.prototype.init = function (_io, _gameArea, logCallback) {
            this.actionTurns = 0;
            this.map = new Herbs.Map();
            this.beingsMap = new Herbs.Map();
            this.beingRepository = new Herbs.BeingRepository(this.beingsMap);
            this.socketIo = _io;
            this.gameArea = _gameArea;
            this.logOnUI = logCallback;
            this.initiateSocket();
            this.hookSocketEvents();
        };
        Game.prototype.handleInputChat = function (text) {
            var self = this;
            var chatCommand = new Herbs.PlayerCommand(1, function () {
                self.logOnUI("Player #" + self.player.getId() + " shouts \"" + text + "\"!!");
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
            this.socket.on('initiate-board', function (msg) {
                self.map.setTileMap(msg.map);
                self.mapWidth = parseInt(msg.width);
                self.mapHeight = parseInt(msg.height);
                self.createBeings(msg.beings);
                self.socket.emit('position-my-player', {});
                self.recreateGameDisplay();
            });
            this.socket.on('position-player', function (data) {
                self.player = Herbs.Being.fromSerialization(data.player);
                self.beingRepository.add(self.player);
                self.initiateFov();
                self.draw();
            });
            this.socket.on('being-moved', function (data) {
                var being = self.beingRepository.get(parseInt(data.id));
                if (!being) {
                    self.beingRepository.add(Herbs.Being.fromSerialization(data));
                }
                else {
                    self.beingRepository.move(being, parseInt(data.x), parseInt(data.y));
                }
                self.draw();
            });
            this.socket.on('being-came', function (data) {
                self.beingRepository.add(Herbs.Being.fromSerialization(data));
                self.draw();
                self.logOnUI("Player #" + data.id + " just connected");
            });
            this.socket.on('being-left', function (data) {
                self.beingRepository.remove(parseInt(data.id));
                self.draw();
                self.logOnUI("Player #" + data.id + " just disconnected");
            });
            this.socket.on('its-your-turn', function (msg) {
                self.actionTurns = parseInt(msg.turns);
                self.logOnUI("It's your turn. You have " + self.actionTurns + " actions left.");
            });
            this.socket.on('being-shouted', function (data) {
                self.logOnUI("Player #" + data.id + " shouts \"" + data.text + "\"!!");
            });
            this.socket.on('disconnect', function (data) {
                self.logOnUI("Disconnected from server");
                self.clearGameDisplay();
            });
        };
        Game.prototype.createBeings = function (serializedBeings) {
            for (var i in serializedBeings) {
                if (serializedBeings.hasOwnProperty(i)) {
                    this.beingRepository.add(Herbs.Being.fromSerialization(serializedBeings[i]));
                }
            }
        };
        Game.prototype.handleScreenResize = function () {
            this.recreateGameDisplay();
            this.draw();
        };
        Game.prototype.clearGameDisplay = function () {
            this.gameArea.empty();
        };
        Game.prototype.recreateGameDisplay = function () {
            var characterAspectRatio = 18 / 11;
            var heightFactor = this.gameArea.outerHeight() / this.mapHeight;
            var widthFactor = this.gameArea.outerWidth() / this.mapWidth * characterAspectRatio;
            var factor = widthFactor;
            if (this.mapHeight * widthFactor > this.gameArea.outerHeight()) {
                factor = heightFactor;
            }
            this.gameArea.empty();
            this.display = new ROT.Display({
                width: this.mapWidth,
                height: this.mapHeight,
                fontSize: Math.floor(factor)
            });
            this.gameArea.append(this.display.getContainer());
        };
        Game.prototype.draw = function () {
            this.display.clear();
            this.drawMap();
            this.drawPlayer();
        };
        Game.prototype.drawPlayer = function () {
            this.display.draw(this.player.getX(), this.player.getY(), this.player.getToken(), this.player.getColor(), "#aa0");
        };
        Game.prototype.drawMap = function () {
            var self = this;
            this.fov.compute(this.player.getX(), this.player.getY(), 5, function (x, y, r, visibility) {
                if (!r) {
                    return;
                }
                var color = (self.map.tileExists(x, y) ? "#aa0" : "#660");
                self.display.draw(x, y, self.map.getTile(x, y), "#fff", color);
                var being = self.beingsMap.getTile(x, y);
                if (being) {
                    self.display.draw(being.getX(), being.getY(), being.getToken(), being.getColor(), "#aa0");
                }
            });
        };
        Game.prototype.initiateFov = function () {
            var self = this;
            this.fov = new ROT.FOV.PreciseShadowcasting(function (x, y) {
                if (self.map.tileExists(x, y)) {
                    return true;
                }
                return false;
            });
        };
        Game.prototype.getMoveCommand = function (x, y, player, beingRepository, map, socket) {
            return function () {
                var newX = player.getX() + x;
                var newY = player.getY() + y;
                if (!map.tileExists(newX, newY)) {
                    return false;
                }
                beingRepository.move(player, newX, newY);
                socket.emit('being-moved', {
                    'id': player.getId(),
                    'x': player.getX(),
                    'y': player.getY()
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
        Game.prototype.handlePlayerKeyEvent = function (e) {
            var command = this.getKeyCommandMap()[e.keyCode];
            if (command) {
                this.executeCommand(command);
            }
        };
        Game.prototype.executeCommand = function (playerCommand) {
            if (this.actionTurns - playerCommand.getTurnCost() < 0) {
                this.logOnUI("You don't have enough turns to do this");
                return;
            }
            if (!playerCommand.execute()) {
                return;
            }
            this.actionTurns -= playerCommand.getTurnCost();
            this.logOnUI("You have " + this.actionTurns + " actions left.");
            this.draw();
        };
        return Game;
    })();
    Herbs.Game = Game;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=Game.js.map