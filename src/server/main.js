


var GameServer = require('./lib/GameServer');
var ServerParameters = require('./lib/ServerParameters');

//var randomSeed = Date.now();
var randomSeed = 19582923;

var server = new GameServer(new ServerParameters(3000, randomSeed));