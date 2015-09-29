
/// <reference path="../../../definitions/rot.d.ts"/>

import GameClient = require('./GameClient');
import BrowserAdapter = require('./BrowserAdapter');
import ClientParameters = require('./ClientParameters');
import GameDisplayAdapter = require('./GameDisplayAdapter');
import Vector2D = require('../../common/Vector2D');

import DropCommand = require('./Commands/Drop');
import MoveCommand = require('./Commands/Move');
import ShoutCommand = require('./Commands/Shout');
import PickUpCommand = require('./Commands/PickUp');
import FloorLookCommand = require('./Commands/FloorLook');
import ConnectCommand = require('./Commands/Connect');

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
        game.handleCommand(new ShoutCommand(text));
    });

    $(window).resize(function() {
        game.handleScreenResize();
    });

    var getKeyCommandMap = function() {
        var map = {};
        map[ROT.VK_UP] =    new MoveCommand(new Vector2D(0, -1));
        map[ROT.VK_RIGHT] = new MoveCommand(new Vector2D(1,  0));
        map[ROT.VK_DOWN] =  new MoveCommand(new Vector2D(0,  1));
        map[ROT.VK_LEFT] =  new MoveCommand(new Vector2D(-1, 0));
        map[ROT.VK_PERIOD]= new FloorLookCommand();
        map[ROT.VK_K]=      new PickUpCommand();
        return map;
    }

    window.addEventListener("keydown", function(e:any) {
        var command = getKeyCommandMap()[e.keyCode];
        if(command) {
            game.handleCommand(command);
        }
    });

    $("#game-chat").keyup(function (e) {
        if (e.keyCode == 13) {
            $('#game-chat-button').click();
        }
    });

    $('#game-items').on('click', 'li', function() {
        var goId = parseInt($(this).attr('goid'));
        game.handleCommand(new DropCommand(goId));
    });

    game.handleCommand(new ConnectCommand());

});