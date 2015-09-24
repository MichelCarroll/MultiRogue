
var GameServer = require('./build/server/GameServer');
var ServerParameters = require('./build/server/ServerParameters');
var GameClient = require('./build/client/lib/GameClient');
var ClientParameters = require('./build/client/lib/ClientParameters');
var TestUIAdapter = require('./build/client/lib/TestUIAdapter');
var Vector2D = require('./build/common/Vector2D');

var DropCommand = require('./build/client/lib/Commands/Drop');
var MoveCommand = require('./build/client/lib/Commands/Move');
var ShoutCommand = require('./build/client/lib/Commands/Shout');
var PickUpCommand = require('./build/client/lib/Commands/PickUp');
var FloorLookCommand = require('./build/client/lib/Commands/FloorLook');


var Simulator = {
    UP: [0, -1],
    RIGHT: [1, 0],
    DOWN: [0, 1],
    LEFT: [-1, 0],
    serverBoots: function() {
        var server = new GameServer(new ServerParameters(null, 19582923));

        return {
            clientConnects: function() {
                var testAdapter = new TestUIAdapter();
                var client = new GameClient(new ClientParameters(null, server.getMessageServer()), testAdapter);

                var obj = {};

                obj.moves = function (direction) {
                    client.handleCommand(new MoveCommand(new Vector2D(direction[0], direction[1])));
                    return obj;
                };

                obj.picksUpOffFloor = function () {
                    client.handleCommand(new PickUpCommand());
                    return obj;
                };

                obj.looksAtFloor = function () {
                    client.handleCommand(new FloorLookCommand());
                    return obj;
                };

                obj.drops = function (objectId) {
                    client.handleCommand(new DropCommand(objectId));
                    return obj;
                };

                obj.shouts = function (text) {
                    client.handleCommand(new ShoutCommand(text));
                    return obj;
                };

                obj.isHoldingItem = function (itemName) {
                    return testAdapter.getItems().filter(function (item) {
                            return itemName === item.name;
                        }).length > 0;
                };

                obj.logDump = function () {
                    console.log(testAdapter.getLog());
                };

                obj.dropsFirstItem = function() {
                    var items = testAdapter.getItems();
                    var itemId = items[0].id;
                    return obj.drops(itemId);
                };

                //- has item
                //- has player
                //- player is highlighted
                //- has log item
                //- log item is on top
                //- x,y has front color
                //- x,y has back color
                //- x,y has token

                return obj;
            }
        }
    }
};


module.exports = Simulator;
