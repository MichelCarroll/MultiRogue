
$(document).ready(function() {


    var playerList = $('#game-players');

    var game = new Herbs.Game();

    game.setAddPlayerToListCallback(function(playerId) {
        this.playerList.append(
            '<li class="list-group-item" pid="'+playerId+'">'+
                'Player #'+playerId+
            '</li>'
        );
    });

    game.setHighlightPlayerInListCallback(function(playerId) {
        this.playerList.find('li.active').removeClass('active');
        this.playerList.find('li[pid="'+playerId+'"]').addClass('active');
    });

    game.setRemovePlayerFromListCallback(function(playerId) {
        this.playerList.find('li[pid="'+playerId+'"]').remove();
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
        this.playerList.empty();
    });

    game.init(io, $('#game'), playerList);

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