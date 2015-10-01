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
import MessageClient = require('../../common/MessageClient');
import SocketIOMessageClient = require('./SocketIOMessageClient');
import DirectMessageClient = require('./DirectMessageClient');
import ClientParameters = require('./ClientParameters');
import Command = require('../../common/Command');
import Message = require('../../common/Message');
import Playable = require('../../common/Components/Playable');
import Serializer = require('../../common/Serializer');
import Context = require('./Context');


var CHAT_LOG_SUCCESS = 'success';
var CHAT_LOG_WARNING = 'warning';
var CHAT_LOG_INFO = 'info';
var CHAT_LOG_DANGER = 'danger';

class GameClient {


    private commander:Commander;
    private context:Context;


    constructor(params:ClientParameters, uiAdapter:UIAdapter)
    {
        this.context = new Context();
        this.context.uiAdapter = uiAdapter;
        this.context.displayAdapter = new DisplayAdapter(this.context.uiAdapter);
        if(params.messagingServer) {
            this.context.messageClient = new DirectMessageClient(params.messagingServer, this.hookSocketEvents.bind(this));
        } else {
            this.context.messageClient = new SocketIOMessageClient(params.serverAddress, this.hookSocketEvents.bind(this));
        }
        this.commander = new Commander(this.context);
    }

    private hookSocketEvents()
    {
        var self = this;

        this.context.messageClient.on('initiate', function(message:Message) {
            var data = message.getData();
            self.connect(data.viewpoint, new Vector2D(parseInt(data.level.width), parseInt(data.level.height)));
            self.initializePlayerList(data.level.players, data.level.current_player_id);
            self.context.uiAdapter.logOnUI("You're now connected as "+self.context.player.getName()+"!", CHAT_LOG_INFO);
        });

        this.context.messageClient.on('being-moved', function(message:Message) {
            self.requestSync();
        });

        this.context.messageClient.on('sync', function(message:Message) {
            self.sync(message.getData().viewpoint);
            self.context.displayAdapter.draw();
        });

        this.context.messageClient.on('player-came', function(message:Message) {
            var data = message.getData();
            var being = new GameObject();
            being.deserialize(data);
            self.context.uiAdapter.logOnUI(being.getName()+" just connected", CHAT_LOG_INFO);
            self.context.uiAdapter.addPlayerToUI(being.getId(), being.getName());
            self.requestSync();
        });

        this.context.messageClient.on('player-left', function(message:Message) {
            var data = message.getData();
            var being = new GameObject();
            being.deserialize(data);
            self.context.uiAdapter.logOnUI(being.getName() + " just disconnected", CHAT_LOG_INFO);
            self.context.uiAdapter.removePlayerFromUI(parseInt(data.id));
            self.requestSync();
        });

        this.context.messageClient.on('its-another-player-turn', function(message:Message) {
            var data = message.getData();
            self.context.uiAdapter.highlightPlayer(data.id);
            self.context.uiAdapter.logOnUI("It's "+data.name+"'s turn.");
        });

        this.context.messageClient.on('its-your-turn', function(message:Message) {
            var data = message.getData();
            self.context.player.deserialize(data.player);;
            self.context.uiAdapter.highlightPlayer(self.context.player.getId());
            self.context.uiAdapter.logOnUI("It's your turn. You have "+self.context.player.getPlayableComponent().getRemainingTurns()+" actions left.", CHAT_LOG_SUCCESS);
            self.context.uiAdapter.setRemainingActionPoints(self.context.player.getPlayableComponent().getRemainingTurns());
        });

        this.context.messageClient.on('being-shouted', function(message:Message) {
            var data = message.getData();
            self.context.uiAdapter.logOnUI(data.name+" shouts \""+data.text+"\"!!", CHAT_LOG_INFO);
        });

        this.context.messageClient.on('disconnect', function(message:Message) {
            self.context.uiAdapter.logOnUI("Disconnected from server", CHAT_LOG_WARNING);
            self.context.displayAdapter.clear();
        });

        this.context.messageClient.on('game-object-remove', function(message:Message) {
            self.requestSync();
        });

        this.context.messageClient.on('game-object-add', function(message:Message) {
            self.requestSync();
        });

        this.context.messageClient.on('debug', function(message:Message){
            var data = message.getData();
            self.context.uiAdapter.logOnUI("Server Error "+data, CHAT_LOG_DANGER);
        });
    }

    private connect(viewpoint:any, mapSize:Vector2D) {
        this.context.level = new Level();
        this.context.player = new GameObject();
        this.sync(viewpoint);
        this.context.displayAdapter.reinitialize(mapSize, this.context.level.getGameObjectLayer());
    }

    private initializePlayerList(players:any, currentPlayerId:number) {
        this.context.uiAdapter.clearPlayerList();
        var self = this;
        players.forEach(function(playerData:any) {
            self.context.uiAdapter.addPlayerToUI(playerData.id, playerData.name);
        });
        if(currentPlayerId) {
            this.context.uiAdapter.highlightPlayer(currentPlayerId);
        }
    }

    private requestSync() {
        this.context.messageClient.send(new Message('sync-request'));
    }

    private sync(viewpoint:any) {
        this.context.level.setViewpoint(viewpoint.layer);
        this.context.player.deserialize(viewpoint.player);
        this.syncInventory();
        this.context.uiAdapter.setRemainingActionPoints(this.context.player.getPlayableComponent().getRemainingTurns());
    }

    private syncInventory() {
        var gos = this.context.player.getContainerComponent().getInventory().getAll();
        this.context.uiAdapter.emptyItems(); // this can be drastically improved...
        var self = this;
        gos.forEach(function(go:GameObject) {
            self.context.uiAdapter.addItemToUI(go.getId(), go.getName());
        });
    }

    public handleScreenResize() {
        this.context.displayAdapter.resize();
    }

    public handleCommand(command:Command) {
        this.commander.executeCommand(command);
    }
}

export = GameClient;