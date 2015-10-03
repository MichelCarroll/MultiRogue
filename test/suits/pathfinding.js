
var should = require("should");
var Simulator = require('../common');

describe('client connects in a level with a follow bot in it', function() {
    var client;
    var server;

    var robotStartsChase = function() {
        return client.hasInLog("Robot #1051 shouts \"*looks at Player #1052* Fresh meat..\"!!");
    };

    var robotStopsChase = function() {
        return client.hasInLog("Robot #1051 shouts \"Hmm... Where did he go..?\"!!");
    };

    beforeEach(function(){
        server = Simulator.serverBoots({numberFollowBots: 1});
        client = server.clientConnects();
    });

    it('should not be alone', function() {
        should(client.hasInLog("You're now connected as Player #1052!")).be.true();
    });

    it('nothing should happen if player stays where he is', function(done) {
        client.wait().then(function() {
            return client.idle().wait();
        }).then(function() {
            should(robotStartsChase()).be.false();
            should(robotStopsChase()).be.false();
        }).done(done, done);
    });

    it('robot should react if player moves close to him', function(done) {
        client.wait().then(function() {
            return client.moveLeft().moveLeft().moveLeft().moveLeft().wait();
        }).then(function() {
            should(robotStartsChase()).be.true();
            should(robotStopsChase()).be.false();
        }).done(done, done);
    });

    it('robot should follow player when he sees him', function(done) {
        client.wait().then(function() {
            client.moveLeft().moveLeft().moveLeft().moveLeft();
            should(client.getTileTokenAt(49, 25)).be.eql('@'); //robot wandered up
            return client.wait();
        }).then(function() {
            should(client.getTileTokenAt(50, 26)).be.eql('@');
        }).done(done, done);
    });

    it('robot should lose player if he runs away', function(done) {
        client.wait().then(function() {
            should(robotStopsChase()).be.false();
            return client.moveLeft().moveRight().moveRight().moveRight().wait();
        }).then(function() {
            return client.moveRight().moveRight().moveRightUp().moveRight().wait();
        }).then(function() {
            return client.moveRight().moveRight().moveRight().moveRight().wait();
        }).then(function() {
            return client.moveRight().moveRight().moveRight().moveRight().wait();
        }).then(function() {
            return client.moveRight().moveRight().moveRightDown().moveRight().wait();
        }).then(function() {
            return client.moveRight().moveRight().moveRight().moveRight().wait();
        }).then(function() {
            should(robotStopsChase()).be.true();
        }).done(done, done);
    });
});