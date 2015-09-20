


var GameServer = require('./lib/GameServer');
var ServerParameters = require('./lib/ServerParameters');

var server = new GameServer(new ServerParameters(3000, Date.now()));