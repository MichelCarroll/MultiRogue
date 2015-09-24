
var should = require("should");
var Simulator = require('../common');

describe('a client shouts, and another listens', function() {
    var client;
    var secondClient;
    var server;
    beforeEach(function(){
        server = Simulator.serverBoots();
        client = server.clientConnects();
        secondClient = server.clientConnects();
    });
    it('should have notification after shout happens', function() {
        client.shouts('hi everybody');
        should(client.hasInLog('You shout "hi everybody"!!')).be.true();
        should(secondClient.hasInLog('Player #101 shouts "hi everybody"!!')).be.true();
    });
    it('third client should not have notification if connecting after shout happens', function() {
        client.shouts('hi everybody');
        var thirdClient = server.clientConnects();
        should(thirdClient.hasInLog('Player #101 shouts "hi everybody"!!')).be.false();
    });
});