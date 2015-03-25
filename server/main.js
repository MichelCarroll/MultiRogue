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
io.on('connection', function (socket) {
    socket.emit('debug', { 'message': 'hey buddy' });
});
http.listen(3000, function () {
    console.log('listening on *:3000');
    console.log(ROT.VK_X);
});
//var map;
//function generateMap() {
//    var digger = new ROT.Map.Digger();
//    var freeCells = [];
//
//    var digCallback = function(x, y, value) {
//        if (value) { return; } /* do not store walls */
//
//        var key = x+","+y;
//        freeCells.push(key);
//        map[key] = ".";
//    }
//
//    digger.create(digCallback.bind(this));
//    generateBoxes(freeCells);
//    createPlayer(freeCells);
//} 
//# sourceMappingURL=main.js.map