/**
 * Created by michelcarroll on 15-03-22.
 */

/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./Being.ts" />
/// <reference path="./BeingRepository.ts" />
/// <reference path="./Map.ts" />
/// <reference path="./PlayerCommand.ts" />

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

        private map:Map;
        private beingsMap:Map;
        private beingRepository:BeingRepository;
        private display:ROT.Display;
        private player:Being;
        private fov:ROT.FOV.PreciseShadowcasting;
        private socket;
        private actionTurns:number;
        private gameArea;
        private socketIo:SocketIO;
        private logOnUI;
        private mapWidth:number;
        private mapHeight:number;
        private playerList;

        public init(_io, _gameArea, logCallback, _playerList)
        {
            this.socketIo = _io;
            this.gameArea = _gameArea;
            this.logOnUI = logCallback;
            this.playerList = _playerList;
            this.initiateSocket();
            this.hookSocketEvents();
        }

        public handleInputChat(text)
        {
            var self = this;
            var chatCommand = new PlayerCommand(1, function() {
                self.logOnUI("Player #"+self.player.getId()+" shouts \""+text+"\"!!", CHAT_LOG_INFO);
                self.socket.emit('shout', {
                    'text': text
                });
                return true;
            });

            this.executeCommand(chatCommand);
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
                self.initializeGame();
                self.map.setTileMap(data.map);
                self.mapWidth = parseInt(data.width);
                self.mapHeight = parseInt(data.height);
                self.createBeings(data.beings);
                self.socket.emit('position-my-player', {});
                self.recreateGameDisplay();

                if(data.current_player_id) {
                    var being = self.beingRepository.get(parseInt(data.current_player_id));
                    self.highlightPlayer(being);
                }
            });

            this.socket.on('position-player', function(data:any) {
                self.player = Being.fromSerialization(data.player);
                self.logOnUI("You're now connected as Player #"+self.player.getId()+"!", CHAT_LOG_INFO);
                self.beingRepository.add(self.player);
                self.addPlayerToUI(self.player);
                self.initiateFov();
                self.draw();
            });

            this.socket.on('being-moved', function(data:any) {
                var being = self.beingRepository.get(parseInt(data.id));
                if(!being) {
                    self.beingRepository.add(Being.fromSerialization(data));
                } else {
                    self.beingRepository.move(being, parseInt(data.x), parseInt(data.y));
                }
                self.draw();
            });

            this.socket.on('being-came', function(data:any) {
                var being = Being.fromSerialization(data);
                self.beingRepository.add(being);
                self.draw();
                self.logOnUI("Player #"+data.id+" just connected", CHAT_LOG_INFO);
                self.addPlayerToUI(being);
            });

            this.socket.on('being-left', function(data:any) {
                self.beingRepository.remove(parseInt(data.id));
                self.draw();
                self.logOnUI("Player #"+data.id+" just disconnected", CHAT_LOG_INFO);
                self.removePlayerFromUI(parseInt(data.id));
            });

            this.socket.on('its-another-player-turn', function(data:any) {
                var being = self.beingRepository.get(parseInt(data.id));
                self.highlightPlayer(being);
                self.logOnUI("It's Player #"+being.getId()+"'s turn.");
            });

            this.socket.on('its-your-turn', function(msg:any) {
                self.actionTurns = parseInt(msg.turns);
                self.highlightPlayer(self.player);
                self.logOnUI("It's your turn. You have "+self.actionTurns+" actions left.", CHAT_LOG_SUCCESS);
            });

            this.socket.on('being-shouted', function(data:any) {
                self.logOnUI("Player #"+data.id+" shouts \""+data.text+"\"!!");
            });

            this.socket.on('disconnect', function(data:any) {
                self.logOnUI("Disconnected from server", CHAT_LOG_WARNING);
                self.clearGameDisplay();
            });
        }

        private highlightPlayer(player:Being)
        {
            this.playerList.find('li.active').removeClass('active');
            this.playerList.find('li[pid="'+player.getId()+'"]').addClass('active');
        }

        private removePlayerFromUI(id:number)
        {
            this.playerList.find('li[pid="'+id+'"]').remove();
        }

        private addPlayerToUI(player:Being)
        {
            this.playerList.append(
                '<li class="list-group-item" pid="'+player.getId()+'">'+
                    'Player #'+player.getId()+
                '</li>'
            );
        }

        private initializeGame()
        {
            this.playerList.empty();
            this.actionTurns = 0;
            this.map = new Map();
            this.beingsMap = new Map();
            this.beingRepository = new BeingRepository(this.beingsMap);
        }

        private createBeings(serializedBeings:any)
        {
            for(var i in serializedBeings) {
                if(serializedBeings.hasOwnProperty(i)) {
                    var being = Being.fromSerialization(serializedBeings[i]);
                    this.beingRepository.add(being);
                    this.addPlayerToUI(being);
                }
            }
        }

        public handleScreenResize()
        {
            this.recreateGameDisplay();
            this.draw();
        }

        private clearGameDisplay()
        {
            this.gameArea.empty();
        }

        private recreateGameDisplay()
        {
            var characterAspectRatio = 18 / 11;
            var heightFactor = this.gameArea.innerHeight() / this.mapHeight;
            var widthFactor = this.gameArea.innerWidth() / this.mapWidth * characterAspectRatio;

            var factor = widthFactor;
            if(this.mapHeight * widthFactor > this.gameArea.innerHeight()) {
                factor = heightFactor;
            }

            this.gameArea.empty();
            this.display = new ROT.Display({
                width: this.mapWidth,
                height: this.mapHeight,
                fontSize: Math.floor(factor)
            });
            this.gameArea.append(this.display.getContainer());
        }

        private draw()
        {
            this.display.clear();
            this.drawMap();
            this.drawPlayer();
        }

        private drawPlayer()
        {
            this.display.draw(this.player.getX(),this.player.getY(),this.player.getToken(),this.player.getColor(), "#aa0");
        }

        private drawMap()
        {
            var self = this;
            this.fov.compute(this.player.getX(), this.player.getY(), 5, function(x, y, r, visibility) {
                if(!r) {
                    return;
                }
                var color = (self.map.tileExists(x,y) ? "#aa0": "#660");
                self.display.draw(x, y, self.map.getTile(x,y), "#fff", color);
                var being = self.beingsMap.getTile(x,y);

                if(being) {
                    self.display.draw(being.getX(),being.getY(),being.getToken(),being.getColor(), "#aa0");
                }
            });

        }

        private initiateFov()
        {
            var self = this;
            this.fov = new ROT.FOV.PreciseShadowcasting(function(x, y) {
                if(self.map.tileExists(x, y)) {
                    return true;
                }
                return false;
            });
        }

        private getMoveCommand(x:number, y:number, player:Being, beingRepository:BeingRepository, map:Map, socket:Socket) {
            return function() {
                var newX = player.getX() + x;
                var newY = player.getY() + y;
                if(!map.tileExists(newX, newY)) {
                    return false;
                }
                beingRepository.move(player, newX, newY);
                socket.emit('being-moved', {
                    'id': player.getId(),
                    'x': player.getX(),
                    'y': player.getY()
                });
                return true;
            };
        }

        private getKeyCommandMap()
        {
            var map = {};
            map[ROT.VK_UP] =    new PlayerCommand(1, this.getMoveCommand(0, -1, this.player, this.beingRepository, this.map, this.socket));
            map[ROT.VK_RIGHT] = new PlayerCommand(1, this.getMoveCommand(1,  0, this.player, this.beingRepository, this.map, this.socket));
            map[ROT.VK_DOWN] =  new PlayerCommand(1, this.getMoveCommand(0,  1, this.player, this.beingRepository, this.map, this.socket));
            map[ROT.VK_LEFT] =  new PlayerCommand(1, this.getMoveCommand(-1, 0, this.player, this.beingRepository, this.map, this.socket));
            return map;
        }

        public handlePlayerKeyEvent(e:KeyboardEvent)
        {
            var command = this.getKeyCommandMap()[e.keyCode];
            if(command) {
                this.executeCommand(command);
            }
        }

        private executeCommand(playerCommand:PlayerCommand)
        {
            if(this.actionTurns == 0) {
                this.logOnUI("It's not your turn!");
                return;
            }
            else if(this.actionTurns - playerCommand.getTurnCost() < 0) {
                this.logOnUI("You don't have enough turns to do this!");
                return;
            }

            if(!playerCommand.execute()) {
                return;
            }

            this.actionTurns -= playerCommand.getTurnCost();

            if(this.actionTurns > 0) {
                this.logOnUI("You have "+this.actionTurns+" actions left.");
            } else {
                this.logOnUI("Your turn is over.");
            }

            this.draw();
        }
    }
}