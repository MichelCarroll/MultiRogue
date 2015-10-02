
var Q = require('q');

var GameServer = require('./build/server/GameServer');
var GameClient = require('./build/client/lib/GameClient');
var TestUIAdapter = require('./build/client/lib/TestUIAdapter');
var Vector2D = require('./build/common/Vector2D');

var DropCommand = require('./build/common/Commands/Drop');
var MoveCommand = require('./build/common/Commands/Move');
var ShoutCommand = require('./build/common/Commands/Shout');
var PickUpCommand = require('./build/common/Commands/PickUp');
var ConnectCommand = require('./build/common/Commands/Connect');
var DisconnectCommand = require('./build/common/Commands/Disconnect');
var IdleCommand = require('./build/common/Commands/Idle');


var UP = [0, -1];
var RIGHT = [1, 0];
var DOWN = [0, 1];
var LEFT = [-1, 0];
var RIGHTUP = [1, -1];
var LEFTDOWN = [-1, 1];
var RIGHTDOWN = [1, 1];
var LEFTUP = [-1, -1];

var Simulator = {
    serverBoots: function(configs) {
        var server = new GameServer(Object.assign(configs ? configs : {}, {randomSeed: 19582923}));

        return {
            clientConnects: function() {
                var testAdapter = new TestUIAdapter();
                var client = new GameClient({ messagingServer: server.getMessageServer()}, testAdapter);
                client.handleCommand(new ConnectCommand(ConnectCommand.PLAYER));

                var obj = {};

                obj.disconnect = function() {
                    client.handleCommand(new DisconnectCommand());
                };

                obj.wait = function() {
                    var deferred = Q.defer();
                    setImmediate(deferred.resolve);
                    return deferred.promise;
                }

                obj.moves = function (direction) {
                    client.handleCommand(new MoveCommand(new Vector2D(direction[0], direction[1])));
                    return obj;
                };

                obj.idle = function() {
                    client.handleCommand(new IdleCommand());
                    return obj;
                };

                obj.moveRightUp = function () {
                    return obj.moves(RIGHTUP);
                };

                obj.move = function (x,y) {
                    return obj.moves([x,y]);
                };

                obj.moveRightDown = function () {
                    return obj.moves(RIGHTDOWN);
                };

                obj.moveLeftUp = function () {
                    return obj.moves(LEFTUP);
                };

                obj.moveLeftDown = function () {
                    return obj.moves(LEFTDOWN);
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

                obj.drops = function (objectId) {
                    client.handleCommand(new DropCommand(objectId));
                    return obj;
                };

                obj.shouts = function (text) {
                    client.handleCommand(new ShoutCommand(text));
                    return obj;
                };


                //CHECKS
                obj.logDump = function () {
                    console.log(testAdapter.getLog());
                };

                obj.isHoldingItem = function (itemName) {
                    return testAdapter.getItems().filter(function (item) {
                            return itemName === item.name;
                        }).length > 0;
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
