
declare var $:any;

import GameDisplayAdapter = require('./GameDisplayAdapter');
import Vector2D = require('../../common/Vector2D');
import UIAdapter = require('./UIAdapter');

class BrowserAdapter implements UIAdapter {

    private getTileCallback:(position:Vector2D, r:number)=>{position:Vector2D; token:string; frontColor:string; backColor:string} = null;
    private getCameraCallback:()=>{position:Vector2D; range:number} = null;
    private display:ROT.Display = null;
    private fov:ROT.IFOV = null;

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
        var camera = this.getCameraCallback();

        var drawCallback = function(x, y, r) {
            var tile = this.getTileCallback(new Vector2D(x, y), r);
            this.display.draw(tile.position.x, tile.position.y, tile.token, tile.frontColor, tile.backColor);
        };

        this.fov.compute(camera.position.x, camera.position.y, camera.range, drawCallback.bind(this));
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
        this.fov = new ROT.FOV.PreciseShadowcasting(adapter.getTileOpacityCallback);
        this.display = new ROT.Display({
            width: adapter.mapSize.x,
            height: adapter.mapSize.y,
            fontSize: this.getBestFontSize(adapter.mapSize)
        });
        this.getCameraCallback = adapter.getCameraCallback;
        this.getTileCallback = adapter.getTileCallback;
        this.setGameCanvas(this.display.getContainer());
    };

}

export = BrowserAdapter;