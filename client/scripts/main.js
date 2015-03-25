
$(document).ready(function() {

    Game.init(io, $('#game'), function(message) {
        $('#game-log').prepend('<li>'+message+'</li>');
    });

});