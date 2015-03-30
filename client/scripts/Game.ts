/**
 * Created by michelcarroll on 15-03-22.
 */

/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./Being.ts" />
/// <reference path="./BeingRepository.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./PlayerCommand.ts" />
/// <reference path="./UIAdapter.ts" />

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
        private beingsBoard:Board;
        private beingRepository:BeingRepository;
        private display:ROT.Display;
        private player:Being;
        private fov:ROT.FOV.PreciseShadowcasting;
        private socket;
        private actionTurns:number;
        private socketIo:SocketIO;
        private mapWidth:number;
        private mapHeight:number;
        private uiAdapter:UIAdapter;
        private levelInitiated:boolean;


        public init(io, uiAdapter)
        {
            this.uiAdapter = uiAdapter;
            this.socketIo = io;
            this.levelInitiated = false;
            this.initiateSocket();
            this.hookSocketEvents();
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
                self.uiAdapter.clearGameDisplay();
                self.createGameDisplay();
                self.initiateFov();

                if(data.current_player_id) {
                    var being = self.beingRepository.get(parseInt(data.current_player_id));
                    self.uiAdapter.highlightPlayer(being.getId());
                }
            });

            this.socket.on('position-player', function(data:any) {
                self.player = Being.fromSerialization(data.player);
                self.uiAdapter.logOnUI("You're now connected as Player #"+self.player.getId()+"!", CHAT_LOG_INFO);
                self.beingRepository.add(self.player);
                self.uiAdapter.addPlayerToUI(self.player.getId());
                self.levelInitiated = true;
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
                self.uiAdapter.logOnUI("Player #"+data.id+" just connected", CHAT_LOG_INFO);
                self.uiAdapter.addPlayerToUI(being.getId());
            });

            this.socket.on('being-left', function(data:any) {
                self.beingRepository.remove(parseInt(data.id));
                self.draw();
                self.uiAdapter.logOnUI("Player #"+data.id+" just disconnected", CHAT_LOG_INFO);
                self.uiAdapter.removePlayerFromUI(parseInt(data.id));
            });

            this.socket.on('its-another-player-turn', function(data:any) {
                var being = self.beingRepository.get(parseInt(data.id));
                self.uiAdapter.highlightPlayer(being.getId());
                self.uiAdapter.logOnUI("It's Player #"+being.getId()+"'s turn.");
            });

            this.socket.on('its-your-turn', function(msg:any) {
                self.actionTurns = parseInt(msg.turns);
                self.uiAdapter.highlightPlayer(self.player.getId());
                self.uiAdapter.logOnUI("It's your turn. You have "+self.actionTurns+" actions left.", CHAT_LOG_SUCCESS);
            });

            this.socket.on('being-shouted', function(data:any) {
                self.uiAdapter.logOnUI("Player #"+data.id+" shouts \""+data.text+"\"!!", CHAT_LOG_INFO);
            });

            this.socket.on('disconnect', function(data:any) {
                self.uiAdapter.logOnUI("Disconnected from server", CHAT_LOG_WARNING);
                self.uiAdapter.clearGameDisplay();
                self.levelInitiated = false;
            });
        }

        private initializeGame()
        {
            this.uiAdapter.clearPlayerList();
            this.actionTurns = 0;
            this.map = new Board();
            this.beingsBoard = new Board();
            this.beingRepository = new BeingRepository(this.beingsBoard);
        }

        private createBeings(serializedBeings:any)
        {
            for(var i in serializedBeings) {
                if(serializedBeings.hasOwnProperty(i)) {
                    var being = Being.fromSerialization(serializedBeings[i]);
                    this.beingRepository.add(being);
                    this.uiAdapter.addPlayerToUI(being.getId());
                }
            }
        }

        public handleScreenResize()
        {
            this.uiAdapter.clearGameDisplay();
            this.createGameDisplay();
            this.draw();
        }

        private createGameDisplay()
        {
            this.display = new ROT.Display({
                width: this.mapWidth,
                height: this.mapHeight,
                fontSize: this.uiAdapter.getBestFontSize(this.mapWidth, this.mapHeight)
            });

            this.uiAdapter.setGameCanvas(this.display.getContainer());
        }

        private draw()
        {
            this.display.clear();
            if(!this.levelInitiated) {
                return;
            }
            this.drawBoard();
            this.drawPlayer();
        }

        private drawPlayer()
        {
            this.display.draw(this.player.getX(),this.player.getY(),this.player.getToken(),this.player.getColor(), "#aa0");
        }

        private drawBoard()
        {
            var self = this;
            this.fov.compute(this.player.getX(), this.player.getY(), 5, function(x, y, r, visibility) {
                if(!r) {
                    return;
                }
                var color = (self.map.tileExists(x,y) ? "#aa0": "#660");
                self.display.draw(x, y, self.map.getTile(x,y), "#fff", color);
                var being = self.beingsBoard.getTile(x,y);

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

        private getMoveCommand(x:number, y:number, player:Being, beingRepository:BeingRepository, map:Board, socket:Socket) {
            return function() {
                var newX = player.getX() + x;
                var newY = player.getY() + y;
                if(!map.tileExists(newX, newY)) {
                    return false;
                }
                if(!beingRepository.move(player, newX, newY)) {
                    return false;
                }
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

        public handlePlayerKeyEvent(keyCode:number)
        {
            var command = this.getKeyCommandMap()[keyCode];
            if(command) {
                this.executeCommand(command);
            }
        }

        private executeCommand(playerCommand:PlayerCommand)
        {
            if(this.actionTurns == 0) {
                this.uiAdapter.logOnUI("It's not your turn!");
                return;
            }
            else if(this.actionTurns - playerCommand.getTurnCost() < 0) {
                this.uiAdapter.logOnUI("You don't have enough turns to do this!");
                return;
            }

            if(!playerCommand.execute()) {
                this.uiAdapter.logOnUI("You can't do that!");
                return;
            }

            this.actionTurns -= playerCommand.getTurnCost();

            if(this.actionTurns > 0) {
                this.uiAdapter.logOnUI("You have "+this.actionTurns+" actions left.");
            } else {
                this.uiAdapter.logOnUI("Your turn is over.");
            }

            this.draw();
        }
    }
}