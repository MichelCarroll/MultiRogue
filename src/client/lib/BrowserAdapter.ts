
declare var $:any;

import GameDisplayAdapter = require('./GameDisplayAdapter');
import Vector2D = require('../../common/Vector2D');
import UIAdapter = require('./UIAdapter');

class BrowserAdapter implements UIAdapter {

    private getTileCallback:(position:Vector2D, r:number)=>{position:Vector2D; token:string; frontColor:string; backColor:string} = null;
    private display:ROT.Display = null;
    private size:Vector2D = null;

    public addPlayerToUI = function(playerId, playerName) {
        $('#game-players').append(
            '<li class="list-group-item" pid="'+playerId+'">'+playerName+'</li>'
        );
    };

    public highlightPlayer = function(playerId) {
        $('#game-players').find('li.active').removeClass('active');
        $('#game-players').find('li[pid="'+playerId+'"]').addClass('active');
    };

    public removePlayerFromUI = function(playerId) {
        $('#game-players').find('li[pid="'+playerId+'"]').remove();
    };

    public addItemToUI = function(itemId, itemName) {
        $('#game-items').append(
            $('<li class="list-group-item" goid="'+itemId+'">'+itemName+'</li>')
        );
    };

    public removeItemFromUI = function(itemId) {
        $('#game-items').find('li[goid="'+itemId+'"]').remove();
    };

    public logOnUI = function(message, logTag) {
        while($('#game-log li').length > 200) {
            $('#game-log li:last').remove();
        }
        var className = 'list-group-item';
        if(logTag) {
            className += ' list-group-item-'+logTag;
        }
        $('#game-log').prepend('<li class="'+className+'">'+message+'</li>');
    };

    public clearPlayerList = function() {
        $('#game-players').empty();
    };

    public clearMap = function() {
        $('#game').empty();
    };

    private setGameCanvas = function(canvas) {
        $('#game').append(canvas);
    };

    public drawMap = function() {
        if(!this.display) {
            return;
        }
        this.display.clear();
        for(var x = 0; x < this.size.x; x++) {
            for(var y = 0; y < this.size.y; y++) {
                var tile = this.getTileCallback(new Vector2D(x, y), 100);
                this.display.draw(tile.position.x, tile.position.y, tile.token, tile.frontColor, tile.backColor);
            }
        }
    };

    private getBestFontSize = function(size:Vector2D) {
        var characterAspectRatio = 18 / 11;
        var heightFactor = $('#game').innerHeight() / size.y;
        var widthFactor = $('#game').innerWidth() / size.x * characterAspectRatio;

        var factor = widthFactor;
        if(size.y * widthFactor > $('#game').innerHeight()) {
            factor = heightFactor;
        }
        return Math.floor(factor);
    };

    public setGameDisplayAdapter = function(adapter:GameDisplayAdapter) {
        if(this.display) {
            this.clearMap();
        }
        this.size = adapter.mapSize;
        this.display = new ROT.Display({
            width: adapter.mapSize.x,
            height: adapter.mapSize.y,
            fontSize: this.getBestFontSize(adapter.mapSize)
        });
        this.getTileCallback = adapter.getTileCallback;
        this.setGameCanvas(this.display.getContainer());
    };
    
    public setRemainingActionPoints(actionPoints:number) {
        if(actionPoints <= 0) {
            $('.action-points-row').addClass('hidden');
        }
        else {
            $('.action-points-row').removeClass('hidden');
            $('.action-points').text(actionPoints.toString());    
        }
    }

}

export = BrowserAdapter;