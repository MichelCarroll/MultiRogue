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
eval(fs.readFileSync(__dirname + '/node_modules/rot.js/rot.js/rot.js', 'utf8'));
var LevelGenerator = require('./LevelGenerator');
var Coordinate = require('./Coordinate');
var GameServer = (function () {
    function GameServer() {
        this.level = (new LevelGenerator()).create();
        this.listenToSocketEvents();
    }
    GameServer.prototype.start = function () {
        http.listen(3000, function () {
        });
    };
    GameServer.prototype.listenToSocketEvents = function () {
        var self = this;
        io.on('connection', function (socket) {
            var player = null;
            socket.emit('initiate-board', self.level.serialize());
            socket.on('position-my-player', function () {
                player = self.level.createNewPlayer(function () {
                    self.callToStartTurns(this, socket);
                });
                socket.emit('position-player', { 'player': player.serialize() });
                socket.broadcast.emit('being-came', player.serialize());
                self.level.resume();
            });
            socket.on('disconnect', function () {
                if (player) {
                    socket.broadcast.emit('being-left', player.serialize());
                    self.level.removePlayer(player);
                }
            });
            socket.on('shout', function (data) {
                if (!self.level.canPlay(player)) {
                    return;
                }
                socket.broadcast.emit('being-shouted', { 'id': player.getId(), 'text': data.text });
                self.level.useTurns(player, 1);
            });
            socket.on('being-moved', function (data) {
                if (!self.level.canPlay(player)) {
                    return;
                }
                try {
                    self.level.movePlayer(player, new Coordinate(parseInt(data.x), parseInt(data.y)));
                }
                catch (error) {
                    self.handleError(player, error, socket);
                    return;
                }
                socket.broadcast.emit('being-moved', player.serialize());
                self.level.useTurns(player, 1);
            });
            socket.on('being-looked-at-floor', function (data) {
                if (!self.level.canPlay(player)) {
                    return;
                }
                socket.broadcast.emit('being-looked-at-floor', player.serialize());
                self.level.useTurns(player, 1);
            });
            socket.on('being-picked-up', function (data) {
                if (!self.level.canPlay(player)) {
                    return;
                }
                try {
                    self.level.pickUpObject(player, parseInt(data.objectId));
                }
                catch (error) {
                    self.handleError(player, error, socket);
                    return;
                }
                socket.broadcast.emit('game-object-remove', { 'id': parseInt(data.objectId) });
                self.level.useTurns(player, 1);
            });
            socket.on('being-dropped', function (data) {
                if (!self.level.canPlay(player)) {
                    return;
                }
                try {
                    self.level.dropObject(player, parseInt(data.objectId));
                }
                catch (error) {
                    self.handleError(player, error, socket);
                    return;
                }
                var go = self.level.getObject(parseInt(data.objectId));
                socket.broadcast.emit('game-object-add', go.serialize());
                self.level.useTurns(player, 1);
            });
        });
    };
    GameServer.prototype.handleError = function (player, error, socket) {
        console.log(error);
        socket.emit('debug', error.message);
        socket.broadcast.emit('being-left', player.serialize());
        this.level.removePlayer(player);
    };
    GameServer.prototype.callToStartTurns = function (player, socket) {
        socket.emit('its-your-turn', { turns: player.getRemainingTurns() });
        socket.broadcast.emit('its-another-player-turn', {
            'id': player.getId(),
            'turns': player.getRemainingTurns()
        });
    };
    return GameServer;
})();
module.exports = GameServer;
//# sourceMappingURL=GameServer.js.map