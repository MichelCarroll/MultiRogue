
import GameClient = require('./GameClient');
import UIAdapter = require('./UIAdapter');
import ClientParameters = require('./ClientParameters');
import Vector2D = require('./Vector2D');

declare var $:any;

$(document).ready(function() {

    var uiAdapter = new UIAdapter();
    var getTileCallback:(position:Vector2D, r:number)=>{position:Vector2D; token:string; frontColor:string; backColor:string} = null;
    var getCameraCallback:()=>{position:Vector2D; range:number} = null;
    var display:ROT.Display = null;
    var fov:ROT.IFOV = null;

    uiAdapter.addPlayerToUI = function(playerId, playerName) {
        $('#game-players').append(
            '<li class="list-group-item" pid="'+playerId+'">'+playerName+'</li>'
        );
    };

    uiAdapter.highlightPlayer = function(playerId) {
        $('#game-players').find('li.active').removeClass('active');
        $('#game-players').find('li[pid="'+playerId+'"]').addClass('active');
    };

    uiAdapter.removePlayerFromUI = function(playerId) {
        $('#game-players').find('li[pid="'+playerId+'"]').remove();
    };

    uiAdapter.addItemToUI = function(itemId, itemName) {
        var elem = $('<li class="list-group-item" goid="'+itemId+'">'+itemName+'</li>');
        $(elem).click(function() {
            var goId = parseInt($(this).attr('goid'));
            game.handleItemClickEvent(goId);
        })
        $('#game-items').append(elem);
    };

    uiAdapter.removeItemFromUI = function(itemId) {
        $('#game-items').find('li[goid="'+itemId+'"]').remove();
    };

    uiAdapter.clickedItemFromUI = function(itemId) {
        $('#game-items').find('li[pid="'+itemId+'"]').remove();
    };

    uiAdapter.logOnUI = function(message, logTag) {
        while($('#game-log li').length > 200) {
            $('#game-log li:last').remove();
        }
        var className = 'list-group-item';
        if(logTag) {
            className += ' list-group-item-'+logTag;
        }
        $('#game-log').prepend('<li class="'+className+'">'+message+'</li>');
    };

    uiAdapter.clearPlayerList = function() {
        $('#game-players').empty();
    };

    uiAdapter.clearMap = function() {
        $('#game').empty();
    };

    var setGameCanvas = function(canvas) {
        $('#game').append(canvas);
    };

    uiAdapter.drawMap = function() {
        if(!display) {
            return;
        }
        display.clear();
        var camera = getCameraCallback();
        fov.compute(camera.position.x, camera.position.y, camera.range, function(x, y, r) {
            var tile = getTileCallback(new Vector2D(x, y), r);
            display.draw(tile.position.x, tile.position.y, tile.token, tile.frontColor, tile.backColor);
        });
    };

    var getBestFontSize = function(size:Vector2D) {
        var characterAspectRatio = 18 / 11;
        var heightFactor = $('#game').innerHeight() / size.y;
        var widthFactor = $('#game').innerWidth() / size.x * characterAspectRatio;

        var factor = widthFactor;
        if(size.y * widthFactor > $('#game').innerHeight()) {
            factor = heightFactor;
        }
        return Math.floor(factor);
    };

    uiAdapter.setMapSize = function(size:Vector2D) {
        display = new ROT.Display({
            width: size.x,
            height: size.y,
            fontSize: getBestFontSize(size)
        });

        setGameCanvas(display.getContainer());
    };

    uiAdapter.setTileCallback = function(callback) {
        getTileCallback = callback;

    };

    uiAdapter.setTileOpacityCallback = function(callback) {
        fov = new ROT.FOV.PreciseShadowcasting(callback);
    }

    uiAdapter.setCameraCallback = function(callback) {
        getCameraCallback = callback;
    };


    var url = '';
    if(document.location.protocol === 'file:') {
        url = 'http://localhost';
    } else {
        url = 'http://'+document.location.hostname;
    }

    var game = new GameClient(new ClientParameters(url+':3000'), uiAdapter);

    $('#game-chat-button').click(function() {
        var text = $('#game-chat').val();
        $('#game-chat').val('');
        game.handleInputChat(text);
    });

    $(window).resize(function() {
       game.handleScreenResize();
    });

    window.addEventListener("keydown", function(e:any) {
        game.handlePlayerKeyEvent(e.keyCode);
    });

    $("#game-chat").keyup(function (e) {
        if (e.keyCode == 13) {
            $('#game-chat-button').click();
        }
    });

});