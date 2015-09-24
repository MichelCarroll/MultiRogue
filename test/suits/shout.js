
var should = require("should");
var Simulator = require('../common');

describe('a client shouts, and another listens', function() {
    var client;
    var secondClient;
    beforeEach(function(){
        var server = Simulator.serverBoots();
        client = server.clientConnects();
        secondClient = server.clientConnects();
    });
    it('should have notification after shout happens', function() {
        client.shouts('hi everybody');
        client.logDump();
        secondClient.logDump();
        should(client.hasInLog('You shout "hi everybody"!!')).be.true();
        should(secondClient.hasInLog('Player #101 shouts "hi everybody"!!')).be.true();
    });
});