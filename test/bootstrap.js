
var should = require("should");

var GameServer = require('./build/server/GameServer');
var ServerParameters = require('./build/server/ServerParameters');
var GameClient = require('./build/client/lib/GameClient');
var ClientParameters = require('./build/client/lib/ClientParameters');
var TestUIAdapter = require('./build/client/lib/TestUIAdapter');

var DropCommand = require('./build/client/lib/Commands/Drop');
var MoveCommand = require('./build/client/lib/Commands/Move');
var ShoutCommand = require('./build/client/lib/Commands/Shout');
var PickUpCommand = require('./build/client/lib/Commands/PickUp');
var FloorLookCommand = require('./build/client/lib/Commands/FloorLook');


var createClient = function(messageServer) {
    var testAdapter = new TestUIAdapter();
    return {
        'client': new GameClient(new ClientParameters(null, messageServer), testAdapter),
        'adapter': testAdapter
    };
};

var server = new GameServer(new ServerParameters(null, 19582923));

var playerOne = createClient(server.getMessageServer());
var playerTwo = createClient(server.getMessageServer());
playerOne.client.handleCommand(new ShoutCommand('test'));
var playerThree = createClient(server.getMessageServer());

describe('player one connects to the server', function() {
    describe('player two connects to the server', function() {
        describe('player one shouts', function() {
            describe('player three connects to the server', function() {
                it('player one gets the self shout log', function() {
                    should(playerOne.adapter.getLog()).containEql({ message: 'You shout "test"!!', tag: undefined });
                });
                it('player two gets the shout log', function() {
                    should(playerTwo.adapter.getLog()).containEql({ message: 'Player #101 shouts "test"!!', tag: 'info' });
                });
                it('player three does not get the shout log', function() {
                    should(playerThree.adapter.getLog()).not.containEql({ message: 'Player #101 shouts "test"!!', tag: 'info' });
                });
            });
        });
    });
});
