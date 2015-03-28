
$(document).ready(function() {

    var game = new Herbs.Game();

    game.setAddPlayerToListCallback(function(playerId) {
        $('#game-players').append(
            '<li class="list-group-item" pid="'+playerId+'">'+
                'Player #'+playerId+
            '</li>'
        );
    });

    game.setHighlightPlayerInListCallback(function(playerId) {
        $('#game-players').find('li.active').removeClass('active');
        $('#game-players').find('li[pid="'+playerId+'"]').addClass('active');
    });

    game.setRemovePlayerFromListCallback(function(playerId) {
        $('#game-players').find('li[pid="'+playerId+'"]').remove();
    });

    game.setLogOnUICallback(function(message, logTag) {
        while($('#game-log li').length > 200) {
            $('#game-log li:last').remove();
        }
        var className = 'list-group-item';
        if(logTag) {
            className += ' list-group-item-'+logTag;
        }
        $('#game-log').prepend('<li class="'+className+'">'+message+'</li>');
    });

    game.setClearPlayerListCallback(function() {
        $('#game-players').empty();
    });

    game.setClearGameDisplayCallback(function() {
        $('#game').empty();
    });

    game.setGameCanvasCallback(function(canvas) {
        $('#game').append(canvas);
    });

    game.setGetBestFontSizeCallback(function(mapWidth, mapHeight) {
        var characterAspectRatio = 18 / 11;
        var heightFactor = $('#game').innerHeight() / mapHeight;
        var widthFactor = $('#game').innerWidth() / mapWidth * characterAspectRatio;

        var factor = widthFactor;
        if(mapHeight * widthFactor > $('#game').innerHeight()) {
            factor = heightFactor;
        }
        return Math.floor(factor);
    })

    game.init(io);

    $('#game-chat-button').click(function() {
        var text = $('#game-chat').val();
        $('#game-chat').val('');
        game.handleInputChat(text);
    });

    $(window).resize(function() {
       game.handleScreenResize();
    });

    window.addEventListener("keydown", function(e) {
        game.handlePlayerKeyEvent(e);
    });

    $("#game-chat").keyup(function (e) {
        if (e.keyCode == 13) {
            $('#game-chat-button').click();
        }
    });

});