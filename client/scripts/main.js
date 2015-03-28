
$(document).ready(function() {

    var logCallback = function(message) {
        $('#game-log').prepend('<li>'+message+'</li>');
    };

    (new Game()).init(io, $('#game'), logCallback);

});