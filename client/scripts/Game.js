/**
 * Created by michelcarroll on 15-03-22.
 */
/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./Being.ts" />
/// <reference path="./BeingRepository.ts" />
/// <reference path="./Map.ts" />
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
                self.createBeings(data.beings);
                self.socket.emit('position-my-player', {});
                self.uiAdapter.clearGameDisplay();
                self.createGameDisplay();
                if (data.current_player_id) {
                    var being = self.beingRepository.get(parseInt(data.current_player_id));
                    self.uiAdapter.highlightPlayer(being.getId());
                }
            });
            this.socket.on('position-player', function (data) {
                self.player = Herbs.Being.fromSerialization(data.player);
                self.uiAdapter.logOnUI("You're now connected as Player #" + self.player.getId() + "!", Herbs.CHAT_LOG_INFO);
                self.beingRepository.add(self.player);
                self.uiAdapter.addPlayerToUI(self.player.getId());
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
                var being = Herbs.Being.fromSerialization(data);
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
            });
        };
        Game.prototype.initializeGame = function () {
            this.uiAdapter.clearPlayerList();
            this.actionTurns = 0;
            this.map = new Herbs.Map();
            this.beingsMap = new Herbs.Map();
            this.beingRepository = new Herbs.BeingRepository(this.beingsMap);
        };
        Game.prototype.createBeings = function (serializedBeings) {
            for (var i in serializedBeings) {
                if (serializedBeings.hasOwnProperty(i)) {
                    var being = Herbs.Being.fromSerialization(serializedBeings[i]);
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
            if (this.actionTurns == 0) {
                this.uiAdapter.logOnUI("It's not your turn!");
                return;
            }
            else if (this.actionTurns - playerCommand.getTurnCost() < 0) {
                this.uiAdapter.logOnUI("You don't have enough turns to do this!");
                return;
            }
            if (!playerCommand.execute()) {
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