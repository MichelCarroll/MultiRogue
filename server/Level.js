/**
 * Created by michelcarroll on 15-03-29.
 */
///<reference path='./ts-definitions/node.d.ts' />
var fs = require('fs');
eval(fs.readFileSync(__dirname + '/node_modules/rot.js/rot.js/rot.js', 'utf8'));
var Repository = require('./Repository');
var Being = require('./Being');
var Level = (function () {
    function Level(map) {
        this.map = map;
        this.goRepository = new Repository();
        this.scheduler = new ROT.Scheduler.Simple();
        this.currentPlayer = null;
    }
    Level.prototype.addAIBeing = function (being) {
        this.goRepository.set(being.getId(), being);
    };
    Level.prototype.addImmobile = function (go) {
        this.goRepository.set(go.getId(), go);
    };
    Level.prototype.createNewPlayer = function (takeTurnCallback) {
        var position = this.map.getRandomTile();
        var player = new Being(position, takeTurnCallback);
        this.goRepository.set(player.getId(), player);
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
        this.goRepository.delete(player.getId());
        this.scheduler.remove(player);
        if (this.currentPlayer === player) {
            this.nextTurn();
        }
    };
    Level.prototype.movePlayer = function (player, position) {
        if (!this.map.tileExists(position)) {
            throw new Error('Cant move there, no tile there');
        }
        if (this.getCollidedGameObjects(position).length) {
            throw new Error('Cant move there, being in the way');
        }
        player.setPosition(position);
    };
    Level.prototype.pickUpObject = function (player, goId) {
        var go = this.goRepository.get(goId);
        if (!go) {
            throw new Error('No GO with this ID');
        }
        else if (!go.getPosition().equals(player.getPosition())) {
            throw new Error('Player isn\'t on the same position as the GO');
        }
        else if (!go.canBePickedUp()) {
            throw new Error('This GO can\'t be picked up');
        }
        player.addToInventory(go);
        this.goRepository.delete(go.getId());
    };
    Level.prototype.dropObject = function (player, goId) {
        var go = player.getInventory().get(goId);
        if (!go) {
            throw new Error('No GO with this ID');
        }
        player.removeFromInventory(go);
        go.setPosition(player.getPosition().copy());
        this.goRepository.set(go.getId(), go);
        return go;
    };
    Level.prototype.getObject = function (goId) {
        return this.goRepository.get(goId);
    };
    Level.prototype.getCollidedGameObjects = function (position) {
        return this.goRepository.getAll().filter(function (element, index, array) {
            return !element.canBeWalkedThrough() && element.getPosition().equals(position);
        });
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
            'gameObjects': this.goRepository.serialize(),
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