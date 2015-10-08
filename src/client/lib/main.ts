
/// <reference path="../../../definitions/rot.d.ts"/>

import GameClient = require('./GameClient');
import BrowserAdapter = require('./BrowserAdapter');
import GameDisplayAdapter = require('./GameDisplayAdapter');
import Vector2D = require('../../common/Vector2D');

import MoveCommand = require('../../common/Command/Move');
import ShoutCommand = require('../../common/Command/Shout');
import PickUpCommand = require('../../common/Command/PickUp');
import IdleCommand = require('../../common/Command/Idle');


declare var $:any;

$(document).ready(function() {

    var url = '';
    if(document.location.protocol === 'file:') {
        url = 'http://localhost';
    } else {
        url = 'http://'+document.location.hostname;
    }

    var game = new GameClient({serverAddress:url+':3000'}, new BrowserAdapter());

    $('#commands-container li').click(function() {
        var commandName = $(this).data('command');
        switch(commandName) {
            case 'connect':
                game.connect('player');
                break;
            case 'disconnect':
                game.disconnect();
                break;
        }
    });

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
        map[ROT.VK_K]=      new PickUpCommand();
        map[ROT.VK_PERIOD]= new IdleCommand();
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
        game.handleDropCommand(goId);
    });

});