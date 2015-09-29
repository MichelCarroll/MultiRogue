
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
        should(client.hasInLog("You're now connected as Player #1051!")).be.true();
    });
    it('second client should not have notification of first', function() {
        secondClient = server.clientConnects();
        should(secondClient.hasInLog("Player #1051 just connected")).be.false();
    });
    it('first client should have notification of second', function() {
        secondClient = server.clientConnects();
        should(client.hasInLog("Player #1052 just connected")).be.true();
    });
    it('first client should see the second player', function() {
        client.moveRight().moveRight().moveRight().moveRight();
        should(client.getTileTokenAt(55, 26)).be.not.eql('@');
        secondClient = server.clientConnects();
        should(client.getTileTokenAt(55, 26)).be.eql('@');
    });

});


describe('first client connects, second connects, then the first client disconnects', function() {
    var client;
    var secondClient;
    var server;
    beforeEach(function(){
        server = Simulator.serverBoots();
        client = server.clientConnects();
        secondClient = server.clientConnects();
    });
    it('first client should have notification', function() {
        client.disconnect();
        should(client.hasInLog("You're now connected as Player #1051!")).be.true();
    });
    it('second client should not have notification of first', function() {
        secondClient = server.clientConnects();
        should(secondClient.hasInLog("Player #1051 just connected")).be.false();
    });
    it('first client should have notification of second', function() {
        secondClient = server.clientConnects();
        should(client.hasInLog("Player #1052 just connected")).be.true();
    });
    it('first client should see the second player', function() {
        client.moveRight().moveRight().moveRight().moveRight();
        should(client.getTileTokenAt(55, 26)).be.not.eql('@');
        secondClient = server.clientConnects();
        should(client.getTileTokenAt(55, 26)).be.eql('@');
    });

});