/**
 * Created by michelcarroll on 15-03-22.
 */

/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./GameObject.ts" />
/// <reference path="./Level.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./UIAdapter.ts" />
/// <reference path="./DisplayAdapter.ts" />
/// <reference path="./Player.ts" />
/// <reference path="./Commander.ts" />


declare class SocketIO {
    connect(url: string): Socket;
}

interface Socket {
    on(event: string, callback: (data: any) => void );
    emit(event: string, data: any);
}

module Herbs {

    export var CHAT_LOG_SUCCESS = 'success';
    export var CHAT_LOG_WARNING = 'warning';
    export var CHAT_LOG_INFO = 'info';
    export var CHAT_LOG_DANGER = 'danger';

    export class Game {

        private map:Board;
        private level:Level;
        private player:Player;
        private socket;
        private socketIo:SocketIO;
        private uiAdapter:UIAdapter;
        private displayAdapter:DisplayAdapter;
        private commander:Commander;


        public init(io, uiAdapter)
        {
            this.uiAdapter = uiAdapter;
            this.displayAdapter = new DisplayAdapter(this.uiAdapter);
            this.socketIo = io;
            this.initiateSocket();
            this.hookSocketEvents();
        }

        private initiateSocket()
        {
            var url = '';
            if(document.location.protocol === 'file:') {
                url = 'http://localhost';
            } else {
                url = 'http://'+document.location.hostname;
            }

            this.socket = this.socketIo.connect(url+':3000');
        }

        private hookSocketEvents()
        {
            var self = this;
            this.socket.on('debug', function(msg:any){
                console.log(msg);
                self.uiAdapter.logOnUI("Server Error "+msg, CHAT_LOG_DANGER);
            });

            this.socket.on('initiate-board', function(data:any) {
                self.uiAdapter.clearPlayerList();
                self.map = new Board(data.map, parseInt(data.width), parseInt(data.height));
                self.level = new Level();
                self.createGameObjects(data.gameObjects);

                if(data.current_player_id) {
                    var being = self.level.get(parseInt(data.current_player_id));
                    self.uiAdapter.highlightPlayer(being.getId());
                }

                self.socket.emit('position-my-player', {});
            });

            this.socket.on('position-player', function(data:any) {
                self.player = Player.fromSerialization(data.player);
                self.uiAdapter.logOnUI("You're now connected as "+self.player.getName()+"!", CHAT_LOG_INFO);
                self.level.add(self.player);
                self.uiAdapter.addPlayerToUI(self.player.getId(), self.player.getName());
                self.commander = new Commander(self.uiAdapter, self.socket, self.player, self.level, self.map, self.displayAdapter);
                self.displayAdapter.reinitialize(self.map, self.player, self.level.getGameObjectLayer());
            });

            this.socket.on('being-moved', function(data:any) {
                var being = self.level.get(parseInt(data.id));
                self.level.move(being, new Coordinate(parseInt(data.x), parseInt(data.y)));
                self.displayAdapter.draw();
            });

            this.socket.on('player-came', function(data:any) {
                var being = GameObject.fromSerialization(data);
                self.level.add(being);
                self.displayAdapter.draw();
                self.uiAdapter.logOnUI(being.getName()+" just connected", CHAT_LOG_INFO);
                self.uiAdapter.addPlayerToUI(being.getId(), being.getName());
            });

            this.socket.on('player-left', function(data:any) {
                var being = self.level.get(parseInt(data.id));
                self.level.remove(being);
                self.displayAdapter.draw();
                self.uiAdapter.logOnUI(being.getName() + " just disconnected", CHAT_LOG_INFO);
                self.uiAdapter.removePlayerFromUI(parseInt(data.id));
            });

            this.socket.on('its-another-player-turn', function(data:any) {
                var being = self.level.get(parseInt(data.id));
                self.uiAdapter.highlightPlayer(being.getId());
                self.uiAdapter.logOnUI("It's "+being.getName()+"'s turn.");
            });

            this.socket.on('its-your-turn', function(msg:any) {
                self.player.giveTurns(parseInt(msg.turns));
                self.uiAdapter.highlightPlayer(self.player.getId());
                self.uiAdapter.logOnUI("It's your turn. You have "+self.player.getRemainingActionTurns()+" actions left.", CHAT_LOG_SUCCESS);
            });

            this.socket.on('being-shouted', function(data:any) {
                var being = self.level.get(parseInt(data.id));
                self.uiAdapter.logOnUI(being.getName()+" shouts \""+data.text+"\"!!", CHAT_LOG_INFO);
            });

            this.socket.on('disconnect', function(data:any) {
                self.uiAdapter.logOnUI("Disconnected from server", CHAT_LOG_WARNING);
                self.commander = null;
                self.displayAdapter.clear();
            });

            this.socket.on('being-looked-at-floor', function(data:any) {
                var being = self.level.get(parseInt(data.id));
                self.uiAdapter.logOnUI(being.getName()+" inspected an object on the floor.", CHAT_LOG_INFO);
            });

            this.socket.on('game-object-remove', function(data:any) {
                var go = self.level.get(parseInt(data.id));
                self.level.remove(go);
                self.displayAdapter.draw();
            });

            this.socket.on('game-object-add', function(data:any) {
                var go = GameObject.fromSerialization(data);
                self.level.add(go);
                self.displayAdapter.draw();
            });
        }

        private createGameObjects(serializedGameObjects:any)
        {
            for(var i in serializedGameObjects) {
                if(serializedGameObjects.hasOwnProperty(i)) {
                    var being = GameObject.fromSerialization(serializedGameObjects[i]);
                    this.level.add(being);
                    if(being.isPlayer()) {
                        this.uiAdapter.addPlayerToUI(being.getId(), being.getName());
                    }
                }
            }
        }

        public handleScreenResize()
        {
            this.displayAdapter.resize();
        }

        public handleInputChat(text)
        {
            if(!this.commander) {
                return;
            }
            this.commander.inputChat(text);
        }

        public handleItemClickEvent(goId:number)
        {
            if(!this.commander) {
                return;
            }
            this.commander.clickItem(goId);
        }

        public handlePlayerKeyEvent(keyCode:number)
        {
            if(!this.commander) {
                return;
            }
            this.commander.pressKey(keyCode);
        }
    }
}