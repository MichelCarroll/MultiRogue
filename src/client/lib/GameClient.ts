/**
 * Created by michelcarroll on 15-03-22.
 */

/// <reference path="../../../definitions/rot.d.ts"/>

import DropCommand = require('../../common/Command/Drop');
import GameObject = require('../../common/GameObject');
import Vector2D = require('../../common/Vector2D');
import Command from '../../common/Command';
import Message = require('../../common/Message');
import Playable = require('../../common/Components/Playable');
import Viewpoint = require('../../common/Viewpoint');


import UIAdapter from './UIAdapter';
import DisplayAdapter = require('./DisplayAdapter');
import Commander = require('./Commander');
import MessageClient from '../../common/MessageClient';
import SocketIOMessageClient = require('./SocketIOMessageClient');
import DirectMessageClient = require('../../common/DirectMessageClient');
import ClientParameters from './ClientParameters';
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
        this.context.setUIAdapter(uiAdapter);
        this.context.setDisplayAdapter(new DisplayAdapter(this.context));
        if(params.messagingServer) {
            this.context.setMessageClient(new DirectMessageClient(params.messagingServer, this.hookSocketEvents.bind(this)));
        } else {
            this.context.setMessageClient(new SocketIOMessageClient(params.serverAddress, this.hookSocketEvents.bind(this)));
        }
        this.commander = new Commander(this.context);
    }

    public connected():boolean {
        return this.context.getMessageClient().isConnected();
    }

    public connect(connectionType:string) {
        this.context.getMessageClient().connect();
        this.context.getUIAdapter().disactivateActionButton('connect');
        this.context.getUIAdapter().activateActionButton('disconnect');
        this.context.getMessageClient().send(new Message('ready', {
            'type': connectionType
        }));
    }

    public disconnect() {
        this.context.getUIAdapter().disactivateActionButton('disconnect');
        this.context.getUIAdapter().activateActionButton('connect');
        this.context.getMessageClient().disconnect();
        this.context.setPlayer(null);
        this.context.setGameObjectLayer(null);
        this.context.getUIAdapter().clearPlayerList();
        this.context.getUIAdapter().setRemainingActionPoints(0);
        this.context.getDisplayAdapter().clear();
    }

    private hookSocketEvents()
    {
        var self = this;

        this.context.getMessageClient().on('initiate', function(message:Message) {
            var data = message.getData();
            self.initiate(data.viewpoint, new Vector2D(parseInt(data.level.width), parseInt(data.level.height)));
            self.initializePlayerList(data.level.players, data.level.current_player_id);
            self.context.getUIAdapter().logOnUI("You're now connected as "+self.context.getPlayer().getName()+"!", CHAT_LOG_INFO);
        });

        this.context.getMessageClient().on('being-moved', function(message:Message) {
            self.requestSync();
        });

        this.context.getMessageClient().on('notification', function(message:Message) {
            self.context.getUIAdapter().logOnUI(message.getData().message, CHAT_LOG_INFO);
        });

        this.context.getMessageClient().on('sync', function(message:Message) {
            self.sync(<Viewpoint>message.getData().viewpoint);
            self.context.getDisplayAdapter().draw();
        });

        this.context.getMessageClient().on('player-came', function(message:Message) {
            var data = message.getData();
            var being = data.player;
            self.context.getUIAdapter().logOnUI(being.getName()+" just connected", CHAT_LOG_INFO);
            self.context.getUIAdapter().addPlayerToUI(being.getId(), being.getName());
            self.requestSync();
        });

        this.context.getMessageClient().on('player-left', function(message:Message) {
            var data = message.getData();
            var being = data.player;
            self.context.getUIAdapter().logOnUI(being.getName() + " just disconnected", CHAT_LOG_INFO);
            self.context.getUIAdapter().removePlayerFromUI(being.getId());
            self.requestSync();
        });

        this.context.getMessageClient().on('its-another-player-turn', function(message:Message) {
            var data = message.getData();
            self.context.getUIAdapter().highlightPlayer(data.id);
            self.context.getUIAdapter().logOnUI("It's "+data.name+"'s turn.");
        });

        this.context.getMessageClient().on('its-your-turn', function(message:Message) {
            var data = message.getData();
            self.context.setPlayer(data.player);
            self.context.getUIAdapter().highlightPlayer(self.context.getPlayer().getId());
            self.context.getUIAdapter().logOnUI("It's your turn. You have "+self.context.getPlayer().getPlayableComponent().getRemainingTurns()+" actions left.", CHAT_LOG_SUCCESS);
            self.context.getUIAdapter().setRemainingActionPoints(self.context.getPlayer().getPlayableComponent().getRemainingTurns());
        });

        this.context.getMessageClient().on('being-shouted', function(message:Message) {
            var data = message.getData();
            self.context.getUIAdapter().logOnUI(data.name+" shouts \""+data.text+"\"!!", CHAT_LOG_INFO);
        });

        this.context.getMessageClient().on('disconnect', function(message:Message) {
            self.context.getUIAdapter().logOnUI("Disconnected from server", CHAT_LOG_WARNING);
            self.context.getDisplayAdapter().clear();
        });

        this.context.getMessageClient().on('game-object-remove', function(message:Message) {
            self.requestSync();
        });

        this.context.getMessageClient().on('game-object-add', function(message:Message) {
            self.requestSync();
        });

        this.context.getMessageClient().on('debug', function(message:Message){
            var data = message.getData();
            self.context.getUIAdapter().logOnUI("Server Error "+data, CHAT_LOG_DANGER);
        });
    }

    private initiate(viewpoint:any, mapSize:Vector2D) {
        this.context.setPlayer(new GameObject());
        this.sync(viewpoint);
        this.context.getDisplayAdapter().reinitialize(mapSize);
    }

    private initializePlayerList(players:any, currentPlayerId:number) {
        this.context.getUIAdapter().clearPlayerList();
        var self = this;
        players.forEach(function(playerData:any) {
            self.context.getUIAdapter().addPlayerToUI(playerData.id, playerData.name);
        });
        if(currentPlayerId) {
            this.context.getUIAdapter().highlightPlayer(currentPlayerId);
        }
    }

    private requestSync() {
        this.context.getMessageClient().send(new Message('sync-request'));
    }

    private sync(viewpoint:Viewpoint) {
        this.context.setGameObjectLayer(viewpoint.getLayer());
        this.context.setPlayer(viewpoint.getActor());
        this.syncInventory();
        this.context.getUIAdapter().setRemainingActionPoints(this.context.getPlayer().getPlayableComponent().getRemainingTurns());
    }

    private syncInventory() {
        var gos = this.context.getPlayer().getContainerComponent().getInventory().getAll();
        this.context.getUIAdapter().emptyItems(); // this can be drastically improved...
        var self = this;
        gos.forEach(function(go:GameObject) {
            self.context.getUIAdapter().addItemToUI(go.getId(), go.getName());
        });
    }

    public handleDropCommand(goId:number) {
        var go = this.context.getPlayer().getContainerComponent().getInventory().get(goId);
        this.handleCommand(new DropCommand(go));
    }

    public handleScreenResize() {
        this.context.getDisplayAdapter().resize();
    }

    public handleCommand(command:Command) {
        this.commander.executeCommand(command);
        this.context.getDisplayAdapter().draw();
    }
}

export = GameClient;