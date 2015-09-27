
var should = require("should");
var Simulator = require('../common');

describe('client logs in and looks around', function() {
    var client;
    beforeEach(function(){
        client = Simulator.serverBoots().clientConnects();
    });
    it('and the wall should look a particular way', function() {
        should(client.getTileTokenAt(46, 26)).be.eql('');
        should(client.getTileFrontColorHex(46, 26)).be.eql('#fff');
        should(client.getTileBackColorHex(46, 26)).be.eql('#660');
    });
    it('and the floor should look a particular way', function() {
        should(client.getTileTokenAt(48, 25)).be.eql('.');
        should(client.getTileFrontColorHex(48, 25)).be.eql('#fff');
        should(client.getTileBackColorHex(48, 25)).be.eql('#aa0');
    });
    it('and the tile with a stick on it should look a particular way', function() {
        should(client.getTileTokenAt(47, 26)).be.eql('/');
        should(client.getTileFrontColorHex(47, 26)).be.eql('#ba8536');
        should(client.getTileBackColorHex(47, 26)).be.eql('#aa0');
    });
    it('and the player should appear on top of the stick if he steps on it', function() {
        client.moveLeft().moveLeft();
        should(client.getTileTokenAt(47, 26)).be.eql('@');
        should(client.getTileFrontColorHex(47, 26)).be.eql('#FF0');
        should(client.getTileBackColorHex(47, 26)).be.eql('#aa0');
    });
});