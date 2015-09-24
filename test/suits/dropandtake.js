
var should = require("should");
var Simulator = require('../common')

describe('client picking up and dropping stick', function() {
    var client;
    beforeEach(function(){
        client = Simulator.serverBoots().clientConnects();
    });
    it('should see the stick on the ground before', function() {
        should(client.getTileTokenAt(46, 27)).be.eql('/');
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
    it('should not see the stick on the ground after picking it up', function() {
        client.moveLeft().moveLeft().moveDown().moveLeft()
            .picksUpOffFloor().moveLeft();
        should(client.getTileTokenAt(46, 27)).not.be.eql('/');
    });
    it('should not be holding stick after dropping it', function() {
        client.moveLeft().moveLeft().moveDown().moveLeft()
            .picksUpOffFloor()
            .dropsFirstItem();
        should(client.isHoldingItem('Wooden Stick')).be.false();
        should(client.hasInLog('You pick up the Wooden Stick.')).be.true();
    });
    it('should see stick on ground after dropping it', function() {
        client.moveLeft().moveLeft().moveDown().moveLeft()
            .picksUpOffFloor()
            .dropsFirstItem().moveLeft();
        should(client.getTileTokenAt(46, 27)).be.eql('/');
    });
});

describe('another client signs in and observes the first picking up a stick', function() {
    var client;
    var secondClient;
    beforeEach(function(){
        var server = Simulator.serverBoots();
        client = server.clientConnects();
        secondClient = server.clientConnects();
    });
    it('should not be holding stick', function() {
        client.moveLeft().moveLeft().picksUpOffFloor().moveRight();
        secondClient.moveLeft().moveLeft().moveLeft().moveLeft();
        should(secondClient.isHoldingItem('Wooden Stick')).be.false();
    });
    it('should see the stick on the ground before', function() {
        client.moveLeft().moveLeft().moveUp().moveUp();
        secondClient.moveLeft().moveLeft().moveLeft().moveLeft();
        should(secondClient.getTileTokenAt(47, 26)).be.eql('/');
    });
    it('shouldnt see the stick on the ground after', function() {
        client.moveLeft().moveLeft().picksUpOffFloor().moveRight();
        secondClient.moveLeft().moveLeft().moveLeft().moveLeft();
        should(secondClient.getTileTokenAt(47, 26)).not.be.eql('/');
    });
});