
var should = require("should");
var Simulator = require('../common');

describe('many clients log in one another another, taking turns in between', function() {
    var client1;
    var client2;
    var client3;
    beforeEach(function(){
        var server = Simulator.serverBoots();
        client1 = server.clientConnects();
        client1.shouts('lol');
        client2 = server.clientConnects();
        client1.shouts('lol').shouts('lol').shouts('lol');
        client3 = server.clientConnects();
        client2.shouts('lol').shouts('lol').shouts('lol').shouts('lol');
        client3.shouts('lol');
    });
    it('clients who didnt follow order get notification', function() {
        should(client1.hasInLog("It's not your turn!")).be.false();
        should(client2.hasInLog("It's not your turn!")).be.false();
        should(client3.hasInLog("It's not your turn!")).be.true();
    });
    it('correct client should be highlighted', function() {
        should(client1.isHighlightedPlayerId(101)).be.true();
        should(client2.isHighlightedPlayerId(101)).be.true();
        should(client3.isHighlightedPlayerId(101)).be.true();
    });
    it('correct clients should be in player list', function() {
        should(client1.hasPlayerIdInList(101)).be.true();
        should(client1.hasPlayerIdInList(102)).be.true();
        should(client1.hasPlayerIdInList(103)).be.true();
        should(client1.hasPlayerIdInList(104)).be.false();
    });
});