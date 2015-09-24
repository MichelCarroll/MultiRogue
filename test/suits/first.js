
var should = require("should");
var Simulator = require('../common')

describe('client picking up and dropping stick', function() {
    var client;
    beforeEach(function(){
        client = Simulator.serverBoots().clientConnects();
    });
    it('should not be holding stick at first', function() {
        should(client.isHoldingItem('Wooden Stick')).be.false();
        should(client.hasInLog('You pick up the Wooden Stick.')).be.false();
    });
    it('should be holding stick after picking it up', function() {
        client.moveLeft().moveLeft().moveDown().moveLeft()
            .picksUpOffFloor();
        should(client.isHoldingItem('Wooden Stick')).be.true();
        should(client.hasInLog('You pick up the Wooden Stick.')).be.true();
    });
    it('should not be holding stick after dropping it', function() {
        client.moveLeft().moveLeft().moveDown().moveLeft()
            .picksUpOffFloor()
            .dropsFirstItem();
        should(client.isHoldingItem('Wooden Stick')).be.false();
        should(client.hasInLog('You pick up the Wooden Stick.')).be.true();
    });
});

describe('another client signs in and observes the first picking up a stick', function() {
    var client;
    var secondClient;
    beforeEach(function(){
        client = Simulator.serverBoots().clientConnects();
        secondClient = Simulator.serverBoots().clientConnects();
        client.moveLeft().moveLeft().picksUpOffFloor().moveRight();
        secondClient.moveLeft().moveLeft().moveLeft().moveLeft();
    });
    it('should not be holding stick', function() {
        should(secondClient.isHoldingItem('Wooden Stick')).be.false();
    });
    it('should have heard other player picking it up', function() {
        should(secondClient.hasInLog('Player #101 picks up the Wooden Stick.')).be.true();
    });
});