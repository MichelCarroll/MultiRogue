
$(document).ready(function() {

    var logCallback = function(message) {
        $('#game-log').prepend('<li>'+message+'</li>');
    };

    var game = new Herbs.Game();
    game.init(io, $('#game'), logCallback);

    $('#game-chat-button').click(function() {
        var text = $('#game-chat').val();
        $('#game-chat').val('');
        game.handleInputChat(text);
    });

});