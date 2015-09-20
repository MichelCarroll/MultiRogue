

var GameServer = require('./build/server/GameServer');
var ServerParameters = require('./build/server/ServerParameters');

var GameClient = require('./build/client/lib/GameClient');
var ClientParameters = require('./build/client/lib/ClientParameters');

var server = new GameServer(new ServerParameters(null, 19582923));
var client = new GameClient(new ClientParameters(null, server.getMessageServer()));