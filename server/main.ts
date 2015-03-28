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
import Being = require('./Being');

var map = {};
var freeCells = new Array();
var beings = new Object();;

(new ROT.Map.Digger(ROT.DEFAULT_WIDTH, ROT.DEFAULT_HEIGHT)).create(function(x, y, value) {
    if (value) { return; } /* do not store walls */

    var key = x+","+y;
    freeCells.push(key);
    map[key] = ".";
});

var scheduler = new ROT.Scheduler.Simple();
var currentPlayer = null;

function nextTurn() {
    currentPlayer = scheduler.next();
    if(currentPlayer) {
        currentPlayer.askToTakeTurn();
    }
}

io.on('connection', function(socket) {

    var player = null;
    var beingSerialized = new Array();

    for(var index in beings) {
        var being = beings[index];
        beingSerialized.push(being.serialize());
    }

    socket.emit('initiate-board', {
        'map': map,
        'beings': beingSerialized
    });

    socket.on('disconnect', function() {
        if(player) {
            console.log('ID ' + player.getId() + ' disconnected');
            delete beings[player.getId()];
            socket.broadcast.emit('being-left', player.serialize());
            scheduler.remove(player);
            if(currentPlayer === player) {
                nextTurn();
            }
        }
    });

    socket.on('position-my-player', function() {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        var parts = key.split(",");
        player = new Being(parts[0], parts[1], function() {
            this.giveTurns(4);
            socket.emit('its-your-turn', { turns: 4 });
        });
        beings[player.getId()] = player;

        socket.emit('position-player', { 'player': player.serialize() });
        socket.broadcast.emit('being-came', player.serialize());

        console.log('ID ' + player.getId() + ' connected');

        scheduler.add(player, true);
        if(!currentPlayer) {
            nextTurn();
        }
    });

    socket.on('shout', function(data) {

        if (currentPlayer !== player || !player.getRemainingTurns()) {
            console.log('invalid move');
            return;
        }

        socket.broadcast.emit('being-shouted', {
            'id': player.getId(),
            'text': data.text
        });

        player.spendTurns(1);
        if(!player.getRemainingTurns()) {
            nextTurn();
        }
    });

    socket.on('being-moved', function(data) {

        if(currentPlayer !== player || !player.getRemainingTurns()) {
            console.log('invalid move');
            return;
        }

        var id = parseInt(data.id);
        var x = parseInt(data.x);
        var y = parseInt(data.y);
        var being = beings[id];
        if(!being) {
            return;
        }

        being.setX(x);
        being.setY(y);
        socket.broadcast.emit('being-moved', being.serialize());
        player.spendTurns(1);
        if(!player.getRemainingTurns()) {
            nextTurn();
        }
    });
});

http.listen(3000, function(){
    console.log('listening on port 3000');
});