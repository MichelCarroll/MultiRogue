/**
 * Created by michelcarroll on 15-03-29.
 */
///<reference path='./ts-definitions/node.d.ts' />
var fs = require('fs');
eval(fs.readFileSync('./node_modules/rot.js/rot.js/rot.js', 'utf8'));
var BeingRepository = require('./BeingRepository');
var Being = require('./Being');
var Level = (function () {
    function Level(map) {
        this.map = map;
        this.beingRepository = new BeingRepository(this.map);
        this.scheduler = new ROT.Scheduler.Simple();
        this.currentPlayer = null;
    }
    Level.prototype.addAIBeing = function (being) {
        this.beingRepository.add(being);
    };
    Level.prototype.createNewPlayer = function (takeTurnCallback) {
        var position = this.map.getRandomUnoccupiedTile();
        var self = this;
        var player = new Being(position, takeTurnCallback);
        this.beingRepository.add(player);
        this.scheduler.add(player, true);
        return player;
    };
    Level.prototype.isPaused = function () {
        return (this.currentPlayer === null);
    };
    Level.prototype.resume = function () {
        if (!this.currentPlayer) {
            this.nextTurn();
        }
    };
    Level.prototype.removePlayer = function (player) {
        this.beingRepository.delete(player);
        this.scheduler.remove(player);
        if (this.currentPlayer === player) {
            this.nextTurn();
        }
    };
    Level.prototype.movePlayer = function (player, position) {
        this.beingRepository.move(player, position);
    };
    Level.prototype.canPlay = function (player) {
        return (this.currentPlayer === player && player.getRemainingTurns() > 0);
    };
    Level.prototype.useTurns = function (player, n) {
        player.spendTurns(n);
        if (!player.getRemainingTurns()) {
            this.nextTurn();
        }
    };
    Level.prototype.nextTurn = function () {
        this.currentPlayer = this.scheduler.next();
        if (this.currentPlayer) {
            this.currentPlayer.giveTurns(Level.TURNS_PER_ROUND);
            this.currentPlayer.askToTakeTurn();
        }
    };
    Level.prototype.serialize = function () {
        return {
            'map': this.map.getTileMap(),
            'beings': this.beingRepository.serialize(),
            'width': this.map.getWidth(),
            'height': this.map.getHeight(),
            'current_player_id': this.currentPlayer ? this.currentPlayer.getId() : null
        };
    };
    Level.TURNS_PER_ROUND = 4;
    return Level;
})();
module.exports = Level;
//# sourceMappingURL=Level.js.map