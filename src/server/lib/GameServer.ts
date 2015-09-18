/**
 * Created by michelcarroll on 15-03-24.
 */

///<reference path='./../../definitions/vendor/socket.io.d.ts' />
///<reference path='./../../definitions/vendor/express3.d.ts' />

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

import Being = require('./Being');
import BeingGenerator = require('./BeingGenerator');
import Board = require('./Board');
import Level = require('./Level');
import LevelGenerator = require('./LevelGenerator');
import Coordinate = require('./Coordinate');
import ROT = require('./ROT');

class GameServer {

    private level:Level;

    constructor() {
        this.level = (new LevelGenerator()).create();
        this.listenToSocketEvents();
    }

    public start() {
        http.listen(3000, function(){});
    }

    private listenToSocketEvents() {
        var self = this;
        io.on('connection', function(socket) {

            var player = self.generatePlayer(socket);

            socket.on('disconnect', function() {
                if(player) {
                    socket.broadcast.emit('player-left', player.serialize());
                    self.level.removePlayer(player);
                }
            });

            socket.on('shout', function(data) {
                if(!self.level.canPlay(player)) {
                    return;
                }
                socket.broadcast.emit('being-shouted', {'id': player.getId(), 'text': data.text});
                self.level.useTurns(player, 1);
            });

            socket.on('being-moved', function(data) {
                if(!self.level.canPlay(player)) {
                    return;
                }

                try {
                    self.level.movePlayer(player, new Coordinate(parseInt(data.x), parseInt(data.y)));
                } catch(error) {
                    self.handleError(player, error, socket);
                    return;
                }

                socket.broadcast.emit('being-moved', player.serialize());
                self.level.useTurns(player, 1);
            });

            socket.on('being-looked-at-floor', function(data) {
                if(!self.level.canPlay(player)) {
                    return;
                }
                socket.broadcast.emit('being-looked-at-floor', player.serialize());
                self.level.useTurns(player, 1);
            });

            socket.on('being-picked-up', function(data) {
                if(!self.level.canPlay(player)) {
                    return;
                }

                try {
                    self.level.pickUpObject(player, parseInt(data.objectId));
                } catch(error) {
                    self.handleError(player, error, socket);
                    return;
                }

                socket.broadcast.emit('game-object-remove', { 'id': parseInt(data.objectId) });
                self.level.useTurns(player, 1);
            });

            socket.on('being-dropped', function(data) {
                if(!self.level.canPlay(player)) {
                    return;
                }

                try {
                    self.level.dropObject(player, parseInt(data.objectId));
                } catch(error) {
                    self.handleError(player, error, socket);
                    return;
                }

                var go = self.level.getObject(parseInt(data.objectId));
                socket.broadcast.emit('game-object-add', go.serialize());
                self.level.useTurns(player, 1);
            });
        });
    }

    private generatePlayer(socket:any):Being {
        var self = this;
        var player = (new BeingGenerator(function() {
            self.callToStartTurns(this, socket);
        })).create();

        this.level.addBeing(player);
        socket.emit('initiate', {
            'level': this.level.serialize(),
            'player': player.serialize()
        });
        socket.broadcast.emit('player-came', player.serialize());
        this.level.resume();
        return player;
    }

    private handleError(player:Being, error:Error, socket) {
        console.log(error);
        socket.emit('debug', error.message);
        socket.broadcast.emit('player-left', player.serialize());
        this.level.removePlayer(player);
    }

    private callToStartTurns(player:Being, socket:any) {
        socket.emit('its-your-turn', { turns: player.getRemainingTurns() });
        socket.broadcast.emit('its-another-player-turn', {
            'id': player.getId(),
            'turns': player.getRemainingTurns()
        });
    }
}

export = GameServer;