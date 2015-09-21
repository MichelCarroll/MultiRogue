

var GameServer = require('./build/server/GameServer');
var ServerParameters = require('./build/server/ServerParameters');

var GameClient = require('./build/client/lib/GameClient');
var ClientParameters = require('./build/client/lib/ClientParameters');
var TestUIAdapter = require('./build/client/lib/TestUIAdapter');

var testAdapter = new TestUIAdapter();

var server = new GameServer(new ServerParameters(null, 19582923));
var client = new GameClient(new ClientParameters(null, server.getMessageServer()), testAdapter);

var DropCommand = require('./build/client/lib/Commands/Drop');
var MoveCommand = require('./build/client/lib/Commands/Move');
var ShoutCommand = require('./build/client/lib/Commands/Shout');
var PickUpCommand = require('./build/client/lib/Commands/PickUp');
var FloorLookCommand = require('./build/client/lib/Commands/FloorLook');


client.handleCommand(new ShoutCommand('test'));
console.log(testAdapter.getLog());