/**
 * Created by michelcarroll on 15-03-24.
 */

///<reference path='./ts-definitions/node.d.ts' />
///<reference path='./ts-definitions/socket.io.d.ts' />
///<reference path='./ts-definitions/express3.d.ts' />

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket){
    socket.emit('debug', { 'message': 'hey buddy'} )
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});