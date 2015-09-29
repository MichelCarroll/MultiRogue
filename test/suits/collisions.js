
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
        should(client.getActionPoints()).be.eql(2);
        client.moveLeft();
        should(client.getActionPoints()).be.eql(2);
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
        should(secondClient.getActionPoints()).be.eql(3);
        secondClient.moveLeft();
        should(secondClient.getActionPoints()).be.eql(3);
    });
    it('and should not have collision notification before knocking into wall', function() {
        should(secondClient.hasInLog("You can't do that!")).be.false();
    });
});