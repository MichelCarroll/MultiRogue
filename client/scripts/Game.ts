/**
 * Created by michelcarroll on 15-03-22.
 */

/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./GameObject.ts" />
/// <reference path="./GameObjectRepository.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./PlayerCommand.ts" />
/// <reference path="./UIAdapter.ts" />
/// <reference path="./DisplayAdapter.ts" />
/// <reference path="./Player.ts" />


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
        private goRepository:GameObjectRepository;
        private player:Player;
        private socket;
        private socketIo:SocketIO;
        private uiAdapter:UIAdapter;
        private displayAdapter:DisplayAdapter;


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
            });

            this.socket.on('initiate-board', function(data:any) {
                self.uiAdapter.clearPlayerList();
                self.map = new Board(data.map, parseInt(data.width), parseInt(data.height));
                self.goRepository = new GameObjectRepository();
                self.createGameObjects(data.gameObjects);

                if(data.current_player_id) {
                    var being = self.goRepository.get(parseInt(data.current_player_id));
                    self.uiAdapter.highlightPlayer(being.getId());
                }

                self.socket.emit('position-my-player', {});
            });

            this.socket.on('position-player', function(data:any) {
                self.player = Player.fromSerialization(data.player);
                self.uiAdapter.logOnUI("You're now connected as "+self.player.getName()+"!", CHAT_LOG_INFO);
                self.goRepository.add(self.player);
                self.uiAdapter.addPlayerToUI(self.player.getId(), self.player.getName());
                self.displayAdapter.reinitialize(self.map, self.player, self.goRepository);
            });

            this.socket.on('being-moved', function(data:any) {
                var being = self.goRepository.get(parseInt(data.id));
                if(!being) {
                    self.goRepository.add(GameObject.fromSerialization(data));
                } else {
                    self.goRepository.move(being, new Coordinate(parseInt(data.x), parseInt(data.y)));
                }
                self.displayAdapter.draw();
            });

            this.socket.on('being-came', function(data:any) {
                var being = GameObject.fromSerialization(data);
                self.goRepository.add(being);
                self.displayAdapter.draw();
                if(being.isPlayer()) {
                    self.uiAdapter.logOnUI(being.getName()+" just connected", CHAT_LOG_INFO);
                    self.uiAdapter.addPlayerToUI(being.getId(), being.getName());
                }
            });

            this.socket.on('being-left', function(data:any) {
                var being = self.goRepository.get(parseInt(data.id));
                if(!being) {
                    return;
                }
                self.goRepository.remove(being);
                self.displayAdapter.draw();
                if(being.isPlayer()) {
                    self.uiAdapter.logOnUI(being.getName() + " just disconnected", CHAT_LOG_INFO);
                    self.uiAdapter.removePlayerFromUI(parseInt(data.id));
                }
            });

            this.socket.on('its-another-player-turn', function(data:any) {
                var being = self.goRepository.get(parseInt(data.id));
                if(!being) {
                    return;
                }
                self.uiAdapter.highlightPlayer(being.getId());
                self.uiAdapter.logOnUI("It's "+being.getName()+"'s turn.");
            });

            this.socket.on('its-your-turn', function(msg:any) {
                self.player.giveTurns(parseInt(msg.turns));
                self.uiAdapter.highlightPlayer(self.player.getId());
                self.uiAdapter.logOnUI("It's your turn. You have "+self.player.getRemainingActionTurns()+" actions left.", CHAT_LOG_SUCCESS);
            });

            this.socket.on('being-shouted', function(data:any) {
                var being = self.goRepository.get(parseInt(data.id));
                if(!being) {
                    return;
                }
                self.uiAdapter.logOnUI(being.getName()+" shouts \""+data.text+"\"!!", CHAT_LOG_INFO);
            });

            this.socket.on('disconnect', function(data:any) {
                self.uiAdapter.logOnUI("Disconnected from server", CHAT_LOG_WARNING);
                self.displayAdapter.clear();
            });

            this.socket.on('being-looked-at-floor', function(data:any) {
                var being = self.goRepository.get(parseInt(data.id));
                if(!being) {
                    return;
                }
                self.uiAdapter.logOnUI(being.getName()+" inspected an object on the floor.", CHAT_LOG_INFO);
            });

            this.socket.on('game-object-remove', function(data:any) {
                var go = self.goRepository.get(parseInt(data.id));
                if(!go) {
                    return;
                }
                self.goRepository.remove(go);
                self.displayAdapter.draw();
            });

            this.socket.on('game-object-add', function(data:any) {
                var go = GameObject.fromSerialization(data);
                self.goRepository.add(go);
                self.displayAdapter.draw();
            });
        }

        private createGameObjects(serializedGameObjects:any)
        {
            for(var i in serializedGameObjects) {
                if(serializedGameObjects.hasOwnProperty(i)) {
                    var being = GameObject.fromSerialization(serializedGameObjects[i]);
                    this.goRepository.add(being);
                    if(being.isPlayer()) {
                        this.uiAdapter.addPlayerToUI(being.getId(), being.getName());
                    }
                }
            }
        }

        public handleInputChat(text)
        {
            var self = this;
            var chatCommand = new PlayerCommand(1, function() {
                self.uiAdapter.logOnUI("You shout \""+text+"\"!!");
                self.socket.emit('shout', {
                    'text': text
                });
                return true;
            });

            this.executeCommand(chatCommand);
        }

        public handleScreenResize()
        {
            this.displayAdapter.resize();
        }

        private getMoveCommand(x:number, y:number, player:GameObject, goRepository:GameObjectRepository, map:Board, socket:Socket) {
            return function() {
                var coord = player.getPosition().add(x, y);
                if(!map.tileExists(coord)) {
                    return false;
                }
                if(!goRepository.move(player, coord)) {
                    return false;
                }
                socket.emit('being-moved', {
                    'id': player.getId(),
                    'x': player.getPosition().x,
                    'y': player.getPosition().y
                });
                return true;
            };
        }

        private getLookAtFloorCommand(player:Player, goRepository:GameObjectRepository, socket:Socket) {
            var self = this;
            return function() {
                var go = goRepository.getTopWalkableGameObjectOnStack(player.getPosition());
                if(!go) {
                    return false;
                }
                self.uiAdapter.logOnUI("You see "+go.getDescription()+".");
                socket.emit('being-looked-at-floor', {
                    'id': player.getId()
                });
                return true;
            }
        }

        private getDropCommand(goId:number, player:Player, goRepository:GameObjectRepository, socket:Socket) {
            var self = this;
            return function() {
                var go = player.getInventory()[goId];
                if(!go) {
                    return false;
                }
                goRepository.dropByPlayer(go, player);
                self.uiAdapter.logOnUI("You drop the "+go.getName()+".");
                self.uiAdapter.removeItemFromUI(go.getId());
                socket.emit('being-dropped', {
                    'playerId': player.getId(),
                    'objectId': go.getId()
                });
                return true;
            }
        }

        private getPickUpCommand(player:Player, goRepository:GameObjectRepository, socket:Socket) {
            var self = this;
            return function() {
                var go = goRepository.getTopPickupableGameObjectOnStack(player.getPosition());
                if(!go) {
                    return false;
                }
                goRepository.pickUpByPlayer(go, player);
                self.uiAdapter.logOnUI("You pick up the "+go.getName()+".");
                self.uiAdapter.addItemToUI(go.getId(), go.getName());
                socket.emit('being-picked-up', {
                    'playerId': player.getId(),
                    'objectId': go.getId()
                });
                return true;
            }
        }

        private getKeyCommandMap()
        {
            var map = {};
            map[ROT.VK_UP] =    new PlayerCommand(1, this.getMoveCommand(0, -1, this.player, this.goRepository, this.map, this.socket));
            map[ROT.VK_RIGHT] = new PlayerCommand(1, this.getMoveCommand(1,  0, this.player, this.goRepository, this.map, this.socket));
            map[ROT.VK_DOWN] =  new PlayerCommand(1, this.getMoveCommand(0,  1, this.player, this.goRepository, this.map, this.socket));
            map[ROT.VK_LEFT] =  new PlayerCommand(1, this.getMoveCommand(-1, 0, this.player, this.goRepository, this.map, this.socket));
            map[ROT.VK_PERIOD]= new PlayerCommand(1, this.getLookAtFloorCommand(this.player, this.goRepository, this.socket));
            map[ROT.VK_K]=      new PlayerCommand(1, this.getPickUpCommand(this.player, this.goRepository, this.socket));
            return map;
        }

        public handleItemClickEvent(goId:number) {
            var command = new PlayerCommand(1, this.getDropCommand(goId, this.player, this.goRepository, this.socket));
            this.executeCommand(command);
        }

        public handlePlayerKeyEvent(keyCode:number)
        {
            var command = this.getKeyCommandMap()[keyCode];
            if(command) {
                this.executeCommand(command);
            }
        }

        private executeCommand(playerCommand:PlayerCommand)
        {
            if(!this.player.getRemainingActionTurns()) {
                this.uiAdapter.logOnUI("It's not your turn!");
                return;
            }
            else if(this.player.getRemainingActionTurns() - playerCommand.getTurnCost() < 0) {
                this.uiAdapter.logOnUI("You don't have enough turns to do this!");
                return;
            }

            if(!playerCommand.execute()) {
                this.uiAdapter.logOnUI("You can't do that!");
                return;
            }

            this.player.useTurns(playerCommand.getTurnCost());

            if(this.player.getRemainingActionTurns() > 0) {
                this.uiAdapter.logOnUI("You have "+this.player.getRemainingActionTurns()+" actions left.");
            } else {
                this.uiAdapter.logOnUI("Your turn is over.");
            }

            this.displayAdapter.draw();
        }
    }
}