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
var Being = require('./Being');
var map = {};
var freeCells = new Array();
var beings = {};
(new ROT.Map.Digger()).create(function (x, y, value) {
    if (value) {
        return;
    } /* do not store walls */
    var key = x + "," + y;
    freeCells.push(key);
    map[key] = ".";
});
io.on('connection', function (socket) {
    var beingSerialized = new Array();
    for (var index in beings) {
        var being = beings[index];
        beingSerialized.push(being.serialize());
    }
    socket.emit('initiate-board', {
        'map': map,
        'beings': beingSerialized
    });
    socket.on('position-my-player', function () {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        var parts = key.split(",");
        var player = new Being(parts[0], parts[1], function () {
        });
        beings[player.getId()] = player;
        socket.emit('position-player', {
            'player': player.serialize()
        });
    });
    socket.on('being-moved', function (data) {
        var id = parseInt(data.id);
        var x = parseInt(data.x);
        var y = parseInt(data.y);
        var being = beings[id];
        being.setX(x);
        being.setY(y);
        socket.broadcast.emit('being-moved', being.serialize());
    });
});
http.listen(3000, function () {
    console.log('listening on *:3000');
});
//# sourceMappingURL=main.js.map