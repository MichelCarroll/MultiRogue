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
        Server.prototype.start = function () {
            http.listen(3000, function () {
                console.log('listening on port 3000');
            });
        };
        Server.prototype.createMap = function (mapWidth, mapHeight) {
            var digger = new ROT.Map.Digger(mapWidth, mapHeight);
            var self = this;
            digger.create(function (x, y, value) {
                if (value) {
                    return;
                } /* do not store walls */
                self.map.addTile(x, y);
            });
        };
        Server.prototype.nextTurn = function () {
            this.currentPlayer = this.scheduler.next();
            if (this.currentPlayer) {
                this.currentPlayer.askToTakeTurn();
            }
        };
        Server.prototype.listenToSocketEvents = function () {
            var self = this;
            io.on('connection', function (socket) {
                var player = null;
                var currentPlayerId = null;
                if (self.currentPlayer) {
                    currentPlayerId = self.currentPlayer.getId();
                }
                socket.emit('initiate-board', {
                    'map': self.map.getTileMap(),
                    'beings': self.beingRepository.serialize(),
                    'width': self.map.getWidth(),
                    'height': self.map.getHeight(),
                    'current_player_id': currentPlayerId
                });
                socket.on('disconnect', function () {
                    if (player) {
                        console.log('ID ' + player.getId() + ' disconnected');
                        self.beingRepository.delete(player.getId());
                        socket.broadcast.emit('being-left', player.serialize());
                        self.scheduler.remove(player);
                        if (self.currentPlayer === player) {
                            self.nextTurn();
                        }
                    }
                });
                socket.on('position-my-player', function () {
                    var key = self.map.getRandomFreeTileKey();
                    var parts = key.split(",");
                    player = new Being(parseInt(parts[0]), parseInt(parts[1]), function () {
                        this.giveTurns(4);
                        socket.emit('its-your-turn', { turns: 4 });
                        socket.broadcast.emit('its-another-player-turn', {
                            'id': player.getId(),
                            'turns': 4
                        });
                    });
                    self.beingRepository.add(player);
                    socket.emit('position-player', { 'player': player.serialize() });
                    socket.broadcast.emit('being-came', player.serialize());
                    console.log('ID ' + player.getId() + ' connected');
                    self.scheduler.add(player, true);
                    if (!self.currentPlayer) {
                        self.nextTurn();
                    }
                });
                socket.on('shout', function (data) {
                    if (self.currentPlayer !== player || !player.getRemainingTurns()) {
                        console.log('invalid move');
                        return;
                    }
                    socket.broadcast.emit('being-shouted', {
                        'id': player.getId(),
                        'text': data.text
                    });
                    player.spendTurns(1);
                    if (!player.getRemainingTurns()) {
                        self.nextTurn();
                    }
                });
                socket.on('being-moved', function (data) {
                    if (self.currentPlayer !== player || !player.getRemainingTurns()) {
                        console.log('invalid move');
                        return;
                    }
                    var id = parseInt(data.id);
                    var x = parseInt(data.x);
                    var y = parseInt(data.y);
                    var being = self.beingRepository.get(id);
                    if (!being) {
                        return;
                    }
                    being.setX(x);
                    being.setY(y);
                    socket.broadcast.emit('being-moved', being.serialize());
                    player.spendTurns(1);
                    if (!player.getRemainingTurns()) {
                        self.nextTurn();
                    }
                });
            });
        };
        return Server;
    })();
    Herbs.Server = Server;
})(Herbs || (Herbs = {}));
var server = new Herbs.Server(100, 50);
server.start();
//# sourceMappingURL=main.js.map