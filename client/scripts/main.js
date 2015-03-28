
$(document).ready(function() {

    var logCallback = function(message) {
        while($('#game-log li').length > 10) {
            $('#game-log li:last').remove();
        }
        $('#game-log').prepend('<li class="list-group-item">'+message+'</li>');
    };

    var game = new Herbs.Game();
    game.init(io, $('#game'), logCallback);

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