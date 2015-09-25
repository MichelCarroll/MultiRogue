
var should = require("should");
var Simulator = require('../common');

describe('first client connects, then second connects', function() {
    var client;
    var secondClient;
    var server;
    beforeEach(function(){
        server = Simulator.serverBoots();
        client = server.clientConnects();
    });
    it('first client should have notification', function() {
        secondClient = server.clientConnects();
        should(client.hasInLog("You're now connected as Player #101!")).be.true();
    });
    it('second client should not have notification of first', function() {
        secondClient = server.clientConnects();
        should(secondClient.hasInLog("Player #101 just connected")).be.false();
    });
    it('first client should have notification of second', function() {
        secondClient = server.clientConnects();
        should(client.hasInLog("Player #102 just connected")).be.true();
    });
    it('first client should see the second player', function() {
        should(client.getTileTokenAt(55, 26)).be.not.eql('@');
        secondClient = server.clientConnects();
        should(client.getTileTokenAt(55, 26)).be.eql('@');
    });

});