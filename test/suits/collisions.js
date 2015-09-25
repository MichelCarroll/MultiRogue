
var should = require("should");
var Simulator = require('../common');

describe('client logs in and knocks into a wall', function() {
    var client;
    beforeEach(function(){
        client = Simulator.serverBoots().clientConnects();
        client.moveLeft().moveLeft();
    });
    it('should not have collision notification before knocking into wall', function() {
        should(client.hasInLog("You can't do that!")).be.false();
    });
    it('should have collision notification', function() {
        client.moveLeft();
        should(client.hasInLog("You can't do that!")).be.true();
    });
    it('should not have spent a turn', function() {
        client.moveLeft();
        should(client.hasInLog("You have 2 actions left.")).be.true();
        should(client.hasInLog("You have 1 actions left.")).be.false();
    });
});

describe('one client knocks into another', function() {
    var client;
    var secondClient;
    beforeEach(function(){
        var server = Simulator.serverBoots();
        client = server.clientConnects();
        secondClient = server.clientConnects();
        client.moveRight().moveRight().moveRight().moveRight();
        secondClient.moveLeft();
    });
    it('and gets a collision notification', function() {
        secondClient.moveLeft();
        should(secondClient.hasInLog("You can't do that!")).be.true();
    });
    it('and should not have spent a turn', function() {
        secondClient.moveLeft();
        should(secondClient.hasInLog("You have 3 actions left.")).be.true();
        should(secondClient.hasInLog("You have 2 actions left.")).be.false();
    });
    it('and should not have collision notification before knocking into wall', function() {
        should(secondClient.hasInLog("You can't do that!")).be.false();
    });
});