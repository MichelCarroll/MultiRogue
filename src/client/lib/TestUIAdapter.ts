
import GameDisplayAdapter = require('./GameDisplayAdapter');
import Vector2D = require('../../common/Vector2D');
import UIAdapter = require('./UIAdapter');

class TestUIAdapter implements UIAdapter {

    private getTileCallback:
        (position:Vector2D)=>
            {position:Vector2D; token:string; frontColor:string; backColor:string} = null;

    private actionPoints:number = 0;
    private players = [];
    private highlightedPlayer = null;
    private items = [];
    private log:string[] = [];

    public addPlayerToUI = function(playerId, playerName) {
        this.players.push({
            id: playerId,
            name: playerName
        });
    };

    public highlightPlayer = function(playerId) {
        this.highlightedPlayer = playerId;
    }

    public removePlayerFromUI = function(playerId) {
        var index = this.players.findIndex(function(player) {
            return player.id == playerId;
        });
        if(index !== -1) {
            delete this.players[index];
        }
        if(this.highlightedPlayer == playerId) {
            this.highlightedPlayer = null;
        }
    }

    public addItemToUI = function(itemId, itemName) {
        this.items.push({
            id: itemId,
            name: itemName
        });
    }

    public removeItemFromUI = function(itemId) {
        var index = this.items.findIndex(function(item) {
            return item.id == itemId;
        });
        if(index !== -1) {
            delete this.items[index];
        }
    };

    public logOnUI = function(message, logTag) {
        this.log.push({
            'message': message,
            'tag': logTag
        });
    };

    public clearPlayerList = function() {
        this.players = [];
    };

    public setGameDisplayAdapter = function(adapter:GameDisplayAdapter) {
        this.getTileCallback = adapter.getTileCallback;
    };

    public clearMap = function() {};
    public drawMap = function() {};


    public getPlayers() {
        return this.players;
    }

    public getLog() {
        return this.log;
    }

    public getItems() {
        return this.items;
    }

    public getHighlightedPlayerId() {
        return this.highlightedPlayer;
    }

    public getTileAt(position:Vector2D) {
        return this.getTileCallback(position);
    }
    
    public setRemainingActionPoints(actionPoints:number) {
        this.actionPoints = actionPoints;
    }

    public getRemainingActionPoints():number {
        return this.actionPoints;
    }
}

export = TestUIAdapter;