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

        private level:Level;
        private player:Player;
        private uiAdapter:UIAdapter;
        private displayAdapter:DisplayAdapter;
        private commander:Commander;


        public init(io, uiAdapter)
        {
            this.uiAdapter = uiAdapter;
            this.displayAdapter = new DisplayAdapter(this.uiAdapter);
            this.hookSocketEvents(this.getSocket(io));
        }

        private getSocket(io:SocketIO):Socket
        {
            var url = '';
            if(document.location.protocol === 'file:') {
                url = 'http://localhost';
            } else {
                url = 'http://'+document.location.hostname;
            }

            return io.connect(url+':3000');
        }

        private hookSocketEvents(socket:Socket)
        {
            var self = this;

            socket.on('initiate', function(data:any) {
                self.uiAdapter.clearPlayerList();
                self.level = new Level();
                self.createGameObjects(data.level.gameObjects);

                if(data.level.current_player_id) {
                    var being = self.level.get(parseInt(data.level.current_player_id));
                    self.uiAdapter.highlightPlayer(being.getId());
                }

                self.player = Player.fromSerialization(data.player);
                self.uiAdapter.logOnUI("You're now connected as "+self.player.getName()+"!", CHAT_LOG_INFO);

                var map = new Board(data.level.map, parseInt(data.level.width), parseInt(data.level.height));
                self.commander = new Commander(self.uiAdapter, socket, self.player, self.level, map, self.displayAdapter);
                self.displayAdapter.reinitialize(map, self.player, self.level.getGameObjectLayer());
            });

            socket.on('being-moved', function(data:any) {
                var being = self.level.get(parseInt(data.id));
                self.level.move(being, new Coordinate(parseInt(data.x), parseInt(data.y)));
                self.displayAdapter.draw();
            });

            socket.on('player-came', function(data:any) {
                var being = GameObject.fromSerialization(data);
                self.level.add(being);
                self.displayAdapter.draw();
                self.uiAdapter.logOnUI(being.getName()+" just connected", CHAT_LOG_INFO);
                self.uiAdapter.addPlayerToUI(being.getId(), being.getName());
            });

            socket.on('player-left', function(data:any) {
                var being = self.level.get(parseInt(data.id));
                self.level.remove(being);
                self.displayAdapter.draw();
                self.uiAdapter.logOnUI(being.getName() + " just disconnected", CHAT_LOG_INFO);
                self.uiAdapter.removePlayerFromUI(parseInt(data.id));
            });

            socket.on('its-another-player-turn', function(data:any) {
                var being = self.level.get(parseInt(data.id));
                self.uiAdapter.highlightPlayer(being.getId());
                self.uiAdapter.logOnUI("It's "+being.getName()+"'s turn.");
            });

            socket.on('its-your-turn', function(msg:any) {
                self.player.giveTurns(parseInt(msg.turns));
                self.uiAdapter.highlightPlayer(self.player.getId());
                self.uiAdapter.logOnUI("It's your turn. You have "+self.player.getRemainingActionTurns()+" actions left.", CHAT_LOG_SUCCESS);
            });

            socket.on('being-shouted', function(data:any) {
                var being = self.level.get(parseInt(data.id));
                self.uiAdapter.logOnUI(being.getName()+" shouts \""+data.text+"\"!!", CHAT_LOG_INFO);
            });

            socket.on('disconnect', function(data:any) {
                self.uiAdapter.logOnUI("Disconnected from server", CHAT_LOG_WARNING);
                self.commander = null;
                self.displayAdapter.clear();
            });

            socket.on('being-looked-at-floor', function(data:any) {
                var being = self.level.get(parseInt(data.id));
                self.uiAdapter.logOnUI(being.getName()+" inspected an object on the floor.", CHAT_LOG_INFO);
            });

            socket.on('game-object-remove', function(data:any) {
                var go = self.level.get(parseInt(data.id));
                self.level.remove(go);
                self.displayAdapter.draw();
            });

            socket.on('game-object-add', function(data:any) {
                var go = GameObject.fromSerialization(data);
                self.level.add(go);
                self.displayAdapter.draw();
            });

            socket.on('debug', function(msg:any){
                console.log(msg);
                self.uiAdapter.logOnUI("Server Error "+msg, CHAT_LOG_DANGER);
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