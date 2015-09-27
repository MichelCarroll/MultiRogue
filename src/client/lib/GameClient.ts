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
            this.messageClient = new SocketIOMessageClient(params.getServerAddress());
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
            self.createGameObjects(data.level.gameObjects);

            if(data.level.current_player_id) {
                var being = self.level.get(parseInt(data.level.current_player_id));
                self.uiAdapter.highlightPlayer(being.getId());
            }

            self.player = new GameObject();
            self.player.deserialize(data.player);
            self.uiAdapter.logOnUI("You're now connected as "+self.player.getName()+"!", CHAT_LOG_INFO);

            var mapSize = new Vector2D(parseInt(data.level.width), parseInt(data.level.height));
            self.commander = new Commander(self.uiAdapter, self.messageClient, self.player, self.level, self.displayAdapter);
            self.displayAdapter.reinitialize(mapSize, self.player, self.level.getGameObjectLayer());
        });

        this.messageClient.on('being-moved', function(message:Message) {
            var data = message.getData();
            var being = self.level.get(parseInt(data.id));
            self.level.move(being, new Vector2D(parseInt(data.x), parseInt(data.y)));
            self.displayAdapter.draw();
        });

        this.messageClient.on('player-came', function(message:Message) {
            var data = message.getData();
            var being = new GameObject();
            being.deserialize(data);
            self.level.add(being);
            self.displayAdapter.draw();
            self.uiAdapter.logOnUI(being.getName()+" just connected", CHAT_LOG_INFO);
            self.uiAdapter.addPlayerToUI(being.getId(), being.getName());
        });

        this.messageClient.on('player-left', function(message:Message) {
            var data = message.getData();
            var being = self.level.get(parseInt(data.id));
            self.level.remove(being);
            self.displayAdapter.draw();
            self.uiAdapter.logOnUI(being.getName() + " just disconnected", CHAT_LOG_INFO);
            self.uiAdapter.removePlayerFromUI(parseInt(data.id));
        });

        this.messageClient.on('its-another-player-turn', function(message:Message) {
            var data = message.getData();
            var being = self.level.get(parseInt(data.id));
            self.uiAdapter.highlightPlayer(being.getId());
            self.uiAdapter.logOnUI("It's "+being.getName()+"'s turn.");
        });

        this.messageClient.on('its-your-turn', function(message:Message) {
            var data = message.getData();
            self.player.getPlayableComponent().giveTurns(parseInt(data.turns));
            self.uiAdapter.highlightPlayer(self.player.getId());
            self.uiAdapter.logOnUI("It's your turn. You have "+self.player.getPlayableComponent().getRemainingTurns()+" actions left.", CHAT_LOG_SUCCESS);
        });

        this.messageClient.on('being-shouted', function(message:Message) {
            var data = message.getData();
            var being = self.level.get(parseInt(data.id));
            self.uiAdapter.logOnUI(being.getName()+" shouts \""+data.text+"\"!!", CHAT_LOG_INFO);
        });

        this.messageClient.on('disconnect', function(message:Message) {
            var data = message.getData();
            self.uiAdapter.logOnUI("Disconnected from server", CHAT_LOG_WARNING);
            self.commander = null;
            self.displayAdapter.clear();
        });

        this.messageClient.on('being-looked-at-floor', function(message:Message) {
            var data = message.getData();
            var being = self.level.get(parseInt(data.id));
            self.uiAdapter.logOnUI(being.getName()+" inspected an object on the floor.", CHAT_LOG_INFO);
        });

        this.messageClient.on('game-object-remove', function(message:Message) {
            var data = message.getData();
            var go = self.level.get(parseInt(data.id));
            self.level.remove(go);
            self.displayAdapter.draw();
        });

        this.messageClient.on('game-object-add', function(message:Message) {
            var data = message.getData();
            var go = new GameObject();
            go.deserialize(data);
            self.level.add(go);
            self.displayAdapter.draw();
        });

        this.messageClient.on('debug', function(message:Message){
            var data = message.getData();
            self.uiAdapter.logOnUI("Server Error "+data, CHAT_LOG_DANGER);
        });
    }

    private createGameObjects(serializedGameObjects:any)
    {
        for(var i in serializedGameObjects) {
            if(serializedGameObjects.hasOwnProperty(i)) {
                var gameObject = (<GameObject>Serializer.deserialize(serializedGameObjects[i].data));
                this.level.add(gameObject);
                if(gameObject.isPlayable()) {
                    this.uiAdapter.addPlayerToUI(gameObject.getId(), gameObject.getName());
                }
            }
        }
    }

    public handleScreenResize() {

        this.displayAdapter.resize();
    }

    public handleCommand(command:Command) {
        this.commander.executeCommand(command);
    }
}

export = GameClient;