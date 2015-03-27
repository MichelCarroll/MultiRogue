
$(document).ready(function() {

    var logCallback = function(message) {
        $('#game-log').prepend('<li>'+message+'</li>');
    };

    Game.init(io, $('#game'), logCallback);

});