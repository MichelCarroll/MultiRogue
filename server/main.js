/**
 * Created by michelcarroll on 15-03-24.
 */
///<reference path='./ts-definitions/node.d.ts' />
///<reference path='./ts-definitions/socket.io.d.ts' />
///<reference path='./ts-definitions/express3.d.ts' />
///<reference path='./bower_components/rot.js-TS/rot.d.ts' />
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
eval(fs.readFileSync('./node_modules/rot.js/rot.js/rot.js', 'utf8'));
var BeingRepository = require('./BeingRepository');
var Being = require('./Being');
var Board = require('./Board');
var Coordinate = require('./Coordinate');
var Herbs;
(function (Herbs) {
    var Server = (function () {
        function Server(mapWidth, mapHeight) {
            this.map = new Board(mapWidth, mapHeight);
            this.beingRepository = new BeingRepository(this.map);
            this.scheduler = new ROT.Scheduler.Simple();
            this.createMap(mapWidth, mapHeight);
            this.listenToSocketEvents();
        }
        Server.prototype.createMap = function (mapWidth, mapHeight) {
            var digger = new ROT.Map.Digger(mapWidth, mapHeight);
            var self = this;
            digger.create(function (x, y, value) {
                if (value) {
                    return;
                } /* do not store walls */
                self.map.addTile(new Coordinate(x, y));
            });
        };
        Server.prototype.start = function () {
            http.listen(3000, function () {
            });
        };
        Server.prototype.listenToSocketEvents = function () {
            var self = this;
            io.on('connection', function (socket) {
                var player = null;
                socket.emit('initiate-board', {
                    'map': self.map.getTileMap(),
                    'beings': self.beingRepository.serialize(),
                    'width': self.map.getWidth(),
                    'height': self.map.getHeight(),
                    'current_player_id': self.currentPlayer ? self.currentPlayer.getId() : null
                });
                socket.on('position-my-player', function () {
                    var position = self.map.getRandomUnoccupiedTile();
                    player = new Being(position, function () {
                        self.startTurn(this, socket, 4);
                    });
                    self.beingRepository.add(player);
                    socket.emit('position-player', { 'player': player.serialize() });
                    socket.broadcast.emit('being-came', player.serialize());
                    self.scheduler.add(player, true);
                    if (!self.currentPlayer) {
                        self.nextTurn();
                    }
                });
                socket.on('disconnect', function () {
                    if (player) {
                        self.beingRepository.delete(player);
                        socket.broadcast.emit('being-left', player.serialize());
                        self.scheduler.remove(player);
                        if (self.currentPlayer === player) {
                            self.nextTurn();
                        }
                    }
                });
                socket.on('shout', function (data) {
                    if (!self.canPlay(player)) {
                        return;
                    }
                    socket.broadcast.emit('being-shouted', { 'id': player.getId(), 'text': data.text });
                    self.useTurns(player, 1);
                });
                socket.on('being-moved', function (data) {
                    if (!self.canPlay(player)) {
                        return;
                    }
                    var being = self.beingRepository.get(parseInt(data.id));
                    if (!being) {
                        return;
                    }
                    self.beingRepository.move(being, new Coordinate(parseInt(data.x), parseInt(data.y)));
                    socket.broadcast.emit('being-moved', being.serialize());
                    self.useTurns(player, 1);
                });
            });
        };
        Server.prototype.nextTurn = function () {
            this.currentPlayer = this.scheduler.next();
            if (this.currentPlayer) {
                this.currentPlayer.askToTakeTurn();
            }
        };
        Server.prototype.startTurn = function (player, socket, n) {
            player.giveTurns(n);
            socket.emit('its-your-turn', { turns: n });
            socket.broadcast.emit('its-another-player-turn', {
                'id': player.getId(),
                'turns': n
            });
        };
        Server.prototype.canPlay = function (player) {
            return (this.currentPlayer === player && player.getRemainingTurns() > 0);
        };
        Server.prototype.useTurns = function (player, n) {
            player.spendTurns(n);
            if (!player.getRemainingTurns()) {
                this.nextTurn();
            }
        };
        return Server;
    })();
    Herbs.Server = Server;
})(Herbs || (Herbs = {}));
var server = new Herbs.Server(100, 50);
server.start();
//# sourceMappingURL=main.js.map