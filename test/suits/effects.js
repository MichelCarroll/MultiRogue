
var should = require("should");
var Simulator = require('../common');

describe('client connects in a level with a follow bot in it', function() {
    var client;
    var server;

    beforeEach(function(){
        server = Simulator.serverBoots({numberFollowBots: 1});
        client = server.clientConnects();
    });

    it('and client should not be a zombie at first', function(done) {
        client.wait().then(function() {
            client.moveLeft().moveLeft().moveLeft().moveLeft();
            should(client.hasPlayerNameInList('Player #1052')).be.true();
        }).done(done, done);
    });

    it('and client should become a zombie', function(done) {
        client.wait().then(function() {
            should(client.hasInLog("You turn into a zombie!")).be.false();
            return client.moveLeft().moveLeft().moveLeft().moveLeft().wait();
        }).then(function() {
            return client.idle().wait();
        }).then(function() {
            return client.idle().wait();
        }).then(function() {
            should(client.hasInLog("You turn into a zombie!")).be.true();
        }).done(done, done);
    });

});