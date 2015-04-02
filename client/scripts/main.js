
$(document).ready(function() {

    var game = new Herbs.Game();
    var uiAdapter = new Herbs.UIAdapter();

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
            var goId = $(this).attr('goid');
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

    uiAdapter.clearGameDisplay = function() {
        $('#game').empty();
    };

    uiAdapter.setGameCanvas = function(canvas) {
        $('#game').append(canvas);
    };

    uiAdapter.getBestFontSize = function(mapWidth, mapHeight) {
        var characterAspectRatio = 18 / 11;
        var heightFactor = $('#game').innerHeight() / mapHeight;
        var widthFactor = $('#game').innerWidth() / mapWidth * characterAspectRatio;

        var factor = widthFactor;
        if(mapHeight * widthFactor > $('#game').innerHeight()) {
            factor = heightFactor;
        }
        return Math.floor(factor);
    };

    game.init(io, uiAdapter);

    $('#game-chat-button').click(function() {
        var text = $('#game-chat').val();
        $('#game-chat').val('');
        game.handleInputChat(text);
    });

    $(window).resize(function() {
       game.handleScreenResize();
    });

    window.addEventListener("keydown", function(e) {
        game.handlePlayerKeyEvent(e.keyCode);
    });

    $("#game-chat").keyup(function (e) {
        if (e.keyCode == 13) {
            $('#game-chat-button').click();
        }
    });

});