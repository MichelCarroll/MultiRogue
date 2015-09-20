
import GameClient = require('./GameClient');
import BrowserAdapter = require('./BrowserAdapter');
import ClientParameters = require('./ClientParameters');
import GameDisplayAdapter = require('./GameDisplayAdapter');
import Vector2D = require('./Vector2D');

declare var $:any;

$(document).ready(function() {

    var url = '';
    if(document.location.protocol === 'file:') {
        url = 'http://localhost';
    } else {
        url = 'http://'+document.location.hostname;
    }

    var game = new GameClient(new ClientParameters(url+':3000'), new BrowserAdapter());

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

    $('#game-items').on('click', 'li', function() {
        var goId = parseInt($(this).attr('goid'));
        game.handleItemClickEvent(goId);
    });

});