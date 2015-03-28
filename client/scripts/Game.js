/**
 * Created by michelcarroll on 15-03-22.
 */
/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./Being.ts" />
/// <reference path="./BeingRepository.ts" />
/// <reference path="./Map.ts" />
var Herbs;
(function (Herbs) {
    var Game = (function () {
        function Game() {
        }
        Game.prototype.init = function (_io, _gameArea, logCallback) {
            this.map = new Herbs.Map();
            this.beingsMap = new Herbs.Map();
            this.beingRepository = new Herbs.BeingRepository(this.beingsMap);
            this.socketIo = _io;
            this.gameArea = _gameArea;
            this.logOnUI = logCallback;
            this.initiateSocket();
            this.hookSocketEvents();
        };
        Game.prototype.inputChat = function (text) {
            if (!this.actionTurns) {
                return;
            }
            this.actionTurns--;
            this.logOnUI("Player #" + this.player.getId() + " shouts \"" + text + "\"!!");
            this.socket.emit('shout', {
                'text': text
            });
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
                self.createBeings(msg.beings);
                self.socket.emit('position-my-player', {});
            });
            this.socket.on('position-player', function (data) {
                self.player = Herbs.Being.fromSerialization(data.player);
                self.beingRepository.add(self.player);
                self.startGame();
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
        };
        Game.prototype.createBeings = function (serializedBeings) {
            for (var i in serializedBeings) {
                if (serializedBeings.hasOwnProperty(i)) {
                    this.beingRepository.add(Herbs.Being.fromSerialization(serializedBeings[i]));
                }
            }
        };
        Game.prototype.startGame = function () {
            this.display = new ROT.Display();
            this.gameArea.append(this.display.getContainer());
            this.initiateFov();
            this.draw();
            var self = this;
            window.addEventListener("keydown", function (e) {
                self.handlePlayerEvent(e);
            });
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
        Game.prototype.handlePlayerEvent = function (e) {
            if (!this.actionTurns) {
                this.logOnUI("It's not your turn yet!");
                return;
            }
            var code = e.keyCode;
            if (code == ROT.VK_RETURN || code == ROT.VK_SPACE) {
                //checkBox();
                return;
            }
            switch (code) {
                case ROT.VK_UP:
                case ROT.VK_RIGHT:
                case ROT.VK_DOWN:
                case ROT.VK_LEFT:
                    this.attemptPlayerMove(code);
                    break;
                default:
                    return;
                    break;
            }
        };
        Game.prototype.attemptPlayerMove = function (code) {
            var keyMap = {};
            keyMap[ROT.VK_UP] = 0;
            keyMap[ROT.VK_RIGHT] = 1;
            keyMap[ROT.VK_DOWN] = 2;
            keyMap[ROT.VK_LEFT] = 3;
            var diff = ROT.DIRS[4][keyMap[code]];
            var newX = this.player.getX() + diff[0];
            var newY = this.player.getY() + diff[1];
            if (!this.map.tileExists(newX, newY)) {
                return;
            }
            this.beingRepository.move(this.player, newX, newY);
            this.socket.emit('being-moved', {
                'id': this.player.getId(),
                'x': this.player.getX(),
                'y': this.player.getY()
            });
            this.actionTurns--;
            this.logOnUI("You have " + this.actionTurns + " actions left.");
            this.draw();
        };
        return Game;
    })();
    Herbs.Game = Game;
})(Herbs || (Herbs = {}));
//# sourceMappingURL=Game.js.map