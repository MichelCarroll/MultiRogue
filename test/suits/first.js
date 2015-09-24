
var should = require("should");
var Simulator = require('../common')

describe('client picking up and dropping stick', function() {
    var client;
    beforeEach(function(){
        client = Simulator.serverBoots().clientConnects();
    });
    it('should not be holding stick at first', function() {
        should(client.isHoldingItem('Wooden Stick')).be.false();
    });
    it('should be holding stick after picking it up', function() {
        client.moves(Simulator.LEFT).moves(Simulator.LEFT).moves(Simulator.DOWN).moves(Simulator.LEFT)
            .picksUpOffFloor();
        should(client.isHoldingItem('Wooden Stick')).be.true();
    });
    it('should not be holding stick after dropping it', function() {
        client.moves(Simulator.LEFT).moves(Simulator.LEFT).moves(Simulator.DOWN).moves(Simulator.LEFT)
            .picksUpOffFloor()
            .dropsFirstItem();
        should(client.isHoldingItem('Wooden Stick')).be.false();
    });
});