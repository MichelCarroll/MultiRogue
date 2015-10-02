
var should = require("should");
var Simulator = require('../common');

describe('client logs in and moves around', function() {
    var client;
    beforeEach(function(){
        client = Simulator.serverBoots().clientConnects();
    });
    it('should be able to move horizontally', function() {
        client.moveLeft();
        should(client.getTileTokenAt(48, 26)).be.eql('@');
    });
    it('should be able to move vertically', function() {
        client.moveDown();
        should(client.getTileTokenAt(49, 27)).be.eql('@');
    });
    it('should be able to move diagonally', function() {
        client.moveRightUp();
        should(client.getTileTokenAt(50, 25)).be.eql('@');
    });
    it('should not be able to move more than a square away', function() {
        should(client.hasInLog("You can't do that!")).be.false();
        client.move(2,2);
        should(client.hasInLog("You can't do that!")).be.true();
        should(client.getTileTokenAt(49, 26)).be.eql('@');
    });
});
