/**
 * Created by michelcarroll on 15-03-22.
 */

/// <reference path="../../../definitions/rot.d.ts"/>

import GameObject = require('../../common/GameObject');
import Level = require('./Level');
import UIAdapter = require('./UIAdapter');
import DisplayAdapter = require('./DisplayAdapter');
import Commander = require('./Commander');
import Vector2D = require('../../common/Vector2D');
import MessageClient = require('./MessageClient');
import SocketIOMessageClient = require('./SocketIOMessageClient');
import DirectMessageClient = require('./DirectMessageClient');
import ClientParameters = require('./ClientParameters');
import Command = require('./Command');
import Message = require('../../common/Message');
import Playable = require('../../common/Components/Playable');
import Serializer = require('../../common/Serializer');

var CHAT_LOG_SUCCESS = 'success';
var CHAT_LOG_WARNING = 'warning';
var CHAT_LOG_INFO = 'info';
var CHAT_LOG_DANGER = 'danger';

class GameClient {

    private level:Level;
    private player:GameObject;
    private uiAdapter:UIAdapter;
    private displayAdapter:DisplayAdapter;
    private commander:Commander;
    private messageClient:MessageClient;


    constructor(params:ClientParameters, uiAdapter:UIAdapter)
    {
        this.uiAdapter = uiAdapter;
        this.displayAdapter = new DisplayAdapter(this.uiAdapter);
        if(params.getMessagingServer()) {
            this.messageClient = new DirectMessageClient(params.getMessagingServer());
        } else {
            this.messageClient = new SocketIOMessageClient(params.getServerAddress(), true);
        }
        this.messageClient.connect();
        this.hookSocketEvents();
        this.messageClient.send(new Message('ready'));
    }

    private hookSocketEvents()
    {
        var self = this;

        this.messageClient.on('initiate', function(message:Message) {
            var data = message.getData();
            self.uiAdapter.clearPlayerList();
            self.level = new Level();
            self.level.setViewpoint(data.viewpoint.layer);

            self.player = new GameObject();
            self.player.deserialize(data.viewpoint.player);
            self.uiAdapter.logOnUI("You're now connected as "+self.player.getName()+"!", CHAT_LOG_INFO);

            data.level.players.forEach(function(playerData:any) {
                self.uiAdapter.addPlayerToUI(playerData.id, playerData.name);
            });

            if(data.level.current_player_id) {
                self.uiAdapter.highlightPlayer(data.level.current_player_id);
            }

            var mapSize = new Vector2D(parseInt(data.level.width), parseInt(data.level.height));
            self.commander = new Commander(self.uiAdapter, self.messageClient, self.player, self.level, self.displayAdapter);
            self.displayAdapter.reinitialize(mapSize, self.level.getGameObjectLayer());
        });

        this.messageClient.on('being-moved', function(message:Message) {
            self.messageClient.send(new Message('sync-request'));
        });

        this.messageClient.on('sync', function(message:Message) {
            self.level.setViewpoint(message.getData().viewpoint.layer);
            self.player.deserialize(message.getData().viewpoint.player);
            self.uiAdapter.setRemainingActionPoints(self.player.getPlayableComponent().getRemainingTurns());
            self.displayAdapter.draw();
        });

        this.messageClient.on('player-came', function(message:Message) {
            var data = message.getData();
            var being = new GameObject();
            being.deserialize(data);
            self.uiAdapter.logOnUI(being.getName()+" just connected", CHAT_LOG_INFO);
            self.uiAdapter.addPlayerToUI(being.getId(), being.getName());
            self.messageClient.send(new Message('sync-request'));
        });

        this.messageClient.on('player-left', function(message:Message) {
            var data = message.getData();
            var being = new GameObject();
            being.deserialize(data);
            self.uiAdapter.logOnUI(being.getName() + " just disconnected", CHAT_LOG_INFO);
            self.uiAdapter.removePlayerFromUI(parseInt(data.id));
            self.messageClient.send(new Message('sync-request'));
        });

        this.messageClient.on('its-another-player-turn', function(message:Message) {
            var data = message.getData();
            self.uiAdapter.highlightPlayer(data.id);
            self.uiAdapter.logOnUI("It's "+data.name+"'s turn.");
        });

        this.messageClient.on('its-your-turn', function(message:Message) {
            var data = message.getData();
            self.player.deserialize(data.player);;
            self.uiAdapter.highlightPlayer(self.player.getId());
            self.uiAdapter.logOnUI("It's your turn. You have "+self.player.getPlayableComponent().getRemainingTurns()+" actions left.", CHAT_LOG_SUCCESS);
            self.uiAdapter.setRemainingActionPoints(self.player.getPlayableComponent().getRemainingTurns());
        });

        this.messageClient.on('being-shouted', function(message:Message) {
            var data = message.getData();
            self.uiAdapter.logOnUI(data.name+" shouts \""+data.text+"\"!!", CHAT_LOG_INFO);
        });

        this.messageClient.on('disconnect', function(message:Message) {
            var data = message.getData();
            self.uiAdapter.logOnUI("Disconnected from server", CHAT_LOG_WARNING);
            self.commander = null;
            self.displayAdapter.clear();
        });

        this.messageClient.on('being-looked-at-floor', function(message:Message) {
            var data = message.getData();
            var being = new GameObject();
            being.deserialize(data);
            self.uiAdapter.logOnUI(being.getName()+" inspected an object on the floor.", CHAT_LOG_INFO);
        });

        this.messageClient.on('game-object-remove', function(message:Message) {
            self.messageClient.send(new Message('sync-request'));
        });

        this.messageClient.on('game-object-add', function(message:Message) {
            self.messageClient.send(new Message('sync-request'));
        });

        this.messageClient.on('debug', function(message:Message){
            var data = message.getData();
            self.uiAdapter.logOnUI("Server Error "+data, CHAT_LOG_DANGER);
        });
    }

    public handleScreenResize() {

        this.displayAdapter.resize();
    }

    public handleCommand(command:Command) {
        this.commander.executeCommand(command);
    }
}

export = GameClient;