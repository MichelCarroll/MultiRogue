
var should = require("should");
var Simulator = require('../common');

describe('client connects in a level with a follow bot in it', function() {
    var client;
    var server;
    beforeEach(function(){
        server = Simulator.serverBoots({includeFollowBot: true});
        client = server.clientConnects();
    });
    it('should not be alone', function() {
        should(client.hasInLog("You're now connected as Player #1052!")).be.true();
    });
    it('nothing should happen if player stays where he is', function(done) {
        client.wait().then(function() {
            return client.idle().wait();
        }).then(function() {
            return client.idle().wait();
        }).then(function() {
            return client.idle().wait();
        }).then(function() {
            should(client.hasInLog("Robot #1051 shouts \"*looks at Player #1052* Fresh meat..\"!!")).be.false();
            should(client.hasInLog("Robot #1051 shouts \"Hmm... Where did he go..?\"!!")).be.false();
        }).done(done, done);
    });
    it('robot should react if player moves close to him', function(done) {
        client.wait().then(function() {
            return client.moveLeft().moveLeft().moveLeft().moveLeft().wait();
        }).then(function() {
            should(client.hasInLog("Robot #1051 shouts \"*looks at Player #1052* Fresh meat..\"!!")).be.true();
            should(client.hasInLog("Robot #1051 shouts \"Hmm... Where did he go..?\"!!")).be.false();
        }).done(done, done);
    });
});