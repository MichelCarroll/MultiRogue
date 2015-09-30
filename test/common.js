
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
var ConnectCommand = require('./build/client/lib/Commands/Connect');
var DisconnectCommand = require('./build/client/lib/Commands/Disconnect');


var UP = [0, -1];
var RIGHT = [1, 0];
var DOWN = [0, 1];
var LEFT = [-1, 0];

var Simulator = {
    serverBoots: function() {
        var server = new GameServer(new ServerParameters(null, 19582923));

        return {
            clientConnects: function() {
                var testAdapter = new TestUIAdapter();
                var client = new GameClient(new ClientParameters(null, server.getMessageServer()), testAdapter);
                client.handleCommand(new ConnectCommand());

                var obj = {};

                obj.disconnect = function() {
                    client.handleCommand(new DisconnectCommand());
                };

                obj.moves = function (direction) {
                    client.handleCommand(new MoveCommand(new Vector2D(direction[0], direction[1])));
                    return obj;
                };

                obj.moveUp = function () {
                    return obj.moves(UP);
                };

                obj.moveDown = function () {
                    return obj.moves(DOWN);
                };

                obj.moveRight = function () {
                    return obj.moves(RIGHT);
                };

                obj.moveLeft = function () {
                    return obj.moves(LEFT);
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

                obj.hasInLog = function(text) {
                    return testAdapter.getLog().filter(function (log) {
                        return text === log.message;
                    }).length > 0;
                };

                obj.dropsFirstItem = function() {
                    var items = testAdapter.getItems();
                    var itemId = items[0].id;
                    return obj.drops(itemId);
                };
                obj.dropsItem = function(itemId) {
                    return obj.drops(itemId);
                }

                obj.getTileTokenAt = function(x, y) {
                    return testAdapter.getTileAt(new Vector2D(x,y)).token;
                };

                obj.getTileFrontColorHex = function(x, y) {
                    return testAdapter.getTileAt(new Vector2D(x,y)).frontColor;
                };

                obj.getTileBackColorHex = function(x, y) {
                    return testAdapter.getTileAt(new Vector2D(x,y)).backColor;
                };

                obj.isHighlightedPlayerId = function(playerId) {
                    return playerId === testAdapter.getHighlightedPlayerId();
                }

                obj.hasPlayerIdInList = function(playerId) {
                    return testAdapter.getPlayers().filter(function (player) {
                            return player.id === playerId;
                        }).length > 0;
                };

                obj.getActionPoints = function() {
                    return testAdapter.getRemainingActionPoints();
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
