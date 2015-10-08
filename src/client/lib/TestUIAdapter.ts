
import Vector2D = require('../../common/Vector2D');

import GameDisplayAdapter = require('./GameDisplayAdapter');
import UIAdapter from './UIAdapter';

class TestUIAdapter implements UIAdapter {

    private getTileCallback:
        (position:Vector2D)=>
            {position:Vector2D; token:string; frontColor:string; backColor:string} = null;

    private actionPoints:number = 0;
    private players:any = [];
    private highlightedPlayer = null;
    private items:any = [];
    private log:any[] = [];
    private activatedActionButtons:string[] = [];

    public emptyItems() {
        this.items = [];
    }

    public addPlayerToUI(playerId, playerName) {
        this.players.push({
            id: playerId,
            name: playerName
        });
    }

    public highlightPlayer(playerId) {
        this.highlightedPlayer = playerId;
    }

    public removePlayerFromUI(playerId) {
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

    public addItemToUI(itemId, itemName) {
        this.items.push({
            id: itemId,
            name: itemName
        });
    }

    public removeItemFromUI(itemId) {
        var index = this.items.findIndex(function(item) {
            return item.id == itemId;
        });
        if(index !== -1) {
            delete this.items[index];
        }
    }

    public logOnUI(message, logTag) {
        this.log.push({
            'message': message,
            'tag': logTag
        });
    }

    public clearPlayerList() {
        this.players = [];
    }

    public setGameDisplayAdapter(adapter:GameDisplayAdapter) {
        this.getTileCallback = adapter.getTileCallback;
    }

    public clearMap() {}
    public drawMap() {}


    public activateActionButton(commandName:string) {
        if(this.activatedActionButtons.indexOf(commandName) === -1) {
            this.activatedActionButtons.push(commandName);
        }
    }

    public disactivateActionButton(commandName:string) {
        var index = this.activatedActionButtons.indexOf(commandName);
        if(index !== -1) {
            this.activatedActionButtons.splice(index, -1);
        }
    }

    public getActivatedActionButtons():string[] {
        return this.activatedActionButtons;
    }

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