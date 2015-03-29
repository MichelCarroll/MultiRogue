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
eval(fs.readFileSync('./node_modules/rot.js/rot.js/rot.js','utf8'));

import BeingRepository = require('./BeingRepository');
import Being = require('./Being');
import Board = require('./Board');
import Level = require('./Level');
import LevelGenerator = require('./LevelGenerator');
import Coordinate = require('./Coordinate');

module Herbs {
    export class Server {

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

                var player:Being = null;

                socket.emit('initiate-board', self.level.serialize());

                socket.on('position-my-player', function() {
                    player = self.level.createNewPlayer(function() {
                        self.startTurn(this, socket);
                    });
                    socket.emit('position-player', { 'player': player.serialize() });
                    socket.broadcast.emit('being-came', player.serialize());
                    self.level.resume();
                });

                socket.on('disconnect', function() {
                    if(player) {
                        socket.broadcast.emit('being-left', player.serialize());
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

                    self.level.movePlayer(player, new Coordinate(parseInt(data.x), parseInt(data.y)));
                    socket.broadcast.emit('being-moved', player.serialize());
                    self.level.useTurns(player, 1);
                });
            });
        }

        private startTurn(player:Being, socket:any) {
            socket.emit('its-your-turn', { turns: player.getRemainingTurns() });
            socket.broadcast.emit('its-another-player-turn', {
                'id': player.getId(),
                'turns': player.getRemainingTurns()
            });
        }

    }
}

var server = new Herbs.Server();
server.start();