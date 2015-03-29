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

module Herbs {
    export class Server {

        private map:Board;
        private beingRepository:BeingRepository;
        private scheduler:ROT.Scheduler.Simple;
        private currentPlayer:Being;

        constructor(mapWidth:number, mapHeight:number) {
            this.map = new Board(mapWidth, mapHeight);
            this.beingRepository = new BeingRepository(this.map);
            this.scheduler = new ROT.Scheduler.Simple();

            this.createMap(mapWidth, mapHeight);
            this.listenToSocketEvents();
        }

        public start() {
            http.listen(3000, function(){});
        }

        private createMap(mapWidth:number, mapHeight:number) {
            var digger = new ROT.Map.Digger(mapWidth, mapHeight);
            var self = this;
            digger.create(function(x, y, value) {
                if (value) { return; } /* do not store walls */
                self.map.addTile(x, y);
            });
        }

        private nextTurn() {
            this.currentPlayer = this.scheduler.next();
            if(this.currentPlayer) {
                this.currentPlayer.askToTakeTurn();
            }
        }

        private listenToSocketEvents() {
            var self = this;
            io.on('connection', function(socket) {

                var player:Being = null;

                socket.emit('initiate-board', {
                    'map': self.map.getTileMap(),
                    'beings': self.beingRepository.serialize(),
                    'width': self.map.getWidth(),
                    'height': self.map.getHeight(),
                    'current_player_id': self.currentPlayer ? self.currentPlayer.getId() : null
                });

                socket.on('position-my-player', function() {
                    var key = self.map.getRandomUnoccupiedTile();
                    var parts = key.split(",");
                    player = new Being(parseInt(parts[0]), parseInt(parts[1]), function() {
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

                    self.scheduler.add(player, true);
                    if(!self.currentPlayer) {
                        self.nextTurn();
                    }
                });

                socket.on('disconnect', function() {
                    if(player) {
                        self.beingRepository.delete(player);
                        socket.broadcast.emit('being-left', player.serialize());
                        self.scheduler.remove(player);
                        if(self.currentPlayer === player) {
                            self.nextTurn();
                        }
                    }
                });

                socket.on('shout', function(data) {

                    if(!self.canPlay(player)) {
                        return;
                    }

                    socket.broadcast.emit('being-shouted', {'id': player.getId(), 'text': data.text});
                    self.useTurns(player, 1);
                });

                socket.on('being-moved', function(data) {

                    if(!self.canPlay(player)) {
                        return;
                    }

                    var being = self.beingRepository.get(parseInt(data.id));
                    if(!being) {
                        return;
                    }

                    self.beingRepository.move(being, parseInt(data.x), parseInt(data.y));
                    socket.broadcast.emit('being-moved', being.serialize());
                    self.useTurns(player, 1);
                });
            });
        }

        private canPlay(player:Being) {
            return (this.currentPlayer === player && player.getRemainingTurns() > 0);
        }

        private useTurns(player:Being, n:number) {
            player.spendTurns(n);
            if(!player.getRemainingTurns()) {
                this.nextTurn();
            }
        }

    }
}

var server = new Herbs.Server(100,50);
server.start();