/**
 * Created by michelcarroll on 15-03-22.
 */

/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./Being.ts" />
/// <reference path="./BeingRepository.ts" />
/// <reference path="./Map.ts" />

declare class SocketIO {
    connect(url: string): Socket;
}

interface Socket {
    on(event: string, callback: (data: any) => void );
    emit(event: string, data: any);
}

module Herbs {
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

        public init(_io, _gameArea, logCallback)
        {
            this.map = new Map();
            this.beingsMap = new Map();
            this.beingRepository = new BeingRepository(this.beingsMap);
            this.socketIo = _io;
            this.gameArea = _gameArea;
            this.logOnUI = logCallback;
            this.initiateSocket();
            this.hookSocketEvents();
        }

        public inputChat(text)
        {
            if(!this.actionTurns) {
                return;
            }

            this.actionTurns--;
            this.logOnUI("Player #"+this.player.getId()+" shouts \""+text+"\"!!");
            this.socket.emit('shout', {
                'text': text
            });
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

            this.socket.on('initiate-board', function(msg:any) {
                self.map.setTileMap(msg.map);
                self.createBeings(msg.beings);
                self.socket.emit('position-my-player', {});
            });

            this.socket.on('position-player', function(data:any) {
                self.player = Being.fromSerialization(data.player);
                self.beingRepository.add(self.player);
                self.startGame();
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
                self.beingRepository.add(Being.fromSerialization(data));
                self.draw();
                self.logOnUI("Player #"+data.id+" just connected");
            });

            this.socket.on('being-left', function(data:any) {
                self.beingRepository.remove(parseInt(data.id));
                self.draw();
                self.logOnUI("Player #"+data.id+" just disconnected");
            });

            this.socket.on('its-your-turn', function(msg:any) {
                self.actionTurns = parseInt(msg.turns);
                self.logOnUI("It's your turn. You have "+self.actionTurns+" actions left.");
            });

            this.socket.on('being-shouted', function(data:any) {
                self.logOnUI("Player #"+data.id+" shouts \""+data.text+"\"!!");
            });
        }

        private createBeings(serializedBeings:any)
        {
            for(var i in serializedBeings) {
                if(serializedBeings.hasOwnProperty(i)) {
                    this.beingRepository.add(
                        Being.fromSerialization(serializedBeings[i])
                    );
                }
            }
        }

        private startGame()
        {
            this.display = new ROT.Display();
            this.gameArea.append(this.display.getContainer());

            this.initiateFov();
            this.draw();

            var self = this;

            window.addEventListener("keydown", function(e:KeyboardEvent) {
                self.handlePlayerEvent(e);
            });
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


        private handlePlayerEvent(e:KeyboardEvent)
        {
            if(!this.actionTurns) {
                this.logOnUI("It's not your turn yet!");
                return;
            }

            var code = e.keyCode;

            if (code == ROT.VK_RETURN || code == ROT.VK_SPACE) {
                //checkBox();
                return;
            }

            switch(code) {
                case ROT.VK_UP:
                case ROT.VK_RIGHT:
                case ROT.VK_DOWN:
                case ROT.VK_LEFT:
                    this.attemptPlayerMove(code);
                    break;
                default:
                    return;
                    break;
            }
        }

        private attemptPlayerMove(code)
        {
            var keyMap = {};
            keyMap[ROT.VK_UP] = 0;
            keyMap[ROT.VK_RIGHT] = 1;
            keyMap[ROT.VK_DOWN] = 2;
            keyMap[ROT.VK_LEFT] = 3;

            var diff = ROT.DIRS[4][keyMap[code]];
            var newX = this.player.getX() + diff[0];
            var newY = this.player.getY() + diff[1];

            if(!this.map.tileExists(newX, newY)) {
                return;
            }

            this.beingRepository.move(this.player, newX, newY);

            this.socket.emit('being-moved', {
                'id': this.player.getId(),
                'x': this.player.getX(),
                'y': this.player.getY()
            });

            this.actionTurns--;
            this.logOnUI("You have "+this.actionTurns+" actions left.");
            this.draw();
        }
    }
}