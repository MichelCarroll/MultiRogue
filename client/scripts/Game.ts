/**
 * Created by michelcarroll on 15-03-22.
 */

/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./Game/Being.ts" />

declare class SocketIO {
    connect(url: string): Socket;
}

interface Socket {
    on(event: string, callback: (data: any) => void );
    emit(event: string, data: any);
}

class Game {

    private display:ROT.Display;
    private map;
    private beingMapLayer;
    private player:Being;
    private beings:any;
    private fov:ROT.FOV.PreciseShadowcasting;
    private socket;
    private actionTurns:number;
    private gameArea;
    private socketIo:SocketIO;
    private logOnUI;

    public init(_io, _gameArea, logCallback)
    {
        this.socketIo = _io;
        this.gameArea = _gameArea;
        this.logOnUI = logCallback;
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

        this.socket.on('initiate-board', function(msg:any) {
            self.map = msg.map;
            self.createBeings(msg.beings);
            self.socket.emit('position-my-player', {});
        });

        this.socket.on('position-player', function(msg:any) {
            self.createPlayer(msg.player);
            self.startGame();
        });

        this.socket.on('being-moved', function(data:any) {
            var being = self.beings[parseInt(data.id)];
            if(!being) {
                self.createBeing(data);
            } else {
                self.moveBeing(being, parseInt(data.x), parseInt(data.y));
            }
            self.draw();
        });

        this.socket.on('being-came', function(data:any) {
            self.createBeing(data);
            self.draw();
            self.logOnUI("Player #"+data.id+" just connected");
        });

        this.socket.on('being-left', function(data:any) {
            self.deleteBeing(parseInt(data.id));
            self.draw();
            self.logOnUI("Player #"+data.id+" just disconnected");
        });

        this.socket.on('its-your-turn', function(msg:any) {
            self.actionTurns = parseInt(msg.turns);
            self.logOnUI("It's your turn. You have "+self.actionTurns+" actions left.");
        });
    }

    private deleteBeing(id)
    {
        var being = this.beings[id];
        if(being) {
            var posKey = being.getX()+','+being.getY();
            if(this.beingMapLayer[posKey] === being) {
                delete this.beingMapLayer[posKey];
            }
            delete this.beings[id];
        }
    }

    private moveBeing(being, x, y)
    {
        var posKey = being.getX()+','+being.getY();
        delete this.beingMapLayer[posKey];
        being.setX(x);
        being.setY(y);
        var posKey = being.getX()+','+being.getY();
        this.beingMapLayer[posKey] = being;
    }

    private createBeings(serializedBeings:any)
    {
        this.beings = new Array();
        this.beingMapLayer = {};
        for(var i in serializedBeings) {
            if(serializedBeings.hasOwnProperty(i)) {
                this.createBeing(serializedBeings[i]);
            }
        }
    }

    private createBeing(serializedBeing:any)
    {
        var being = Being.fromSerialization(serializedBeing);
        this.beings[being.getId()] = being;
        this.beingMapLayer[being.getX()+','+being.getY()] = being;
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

    private drawPlayer() {
        this.display.draw(this.player.getX(),this.player.getY(),this.player.getToken(),this.player.getColor(), "#aa0");
    }

    private createPlayer(data) {
        this.player = Being.fromSerialization(data);
    }

    private drawMap()
    {
        var self = this;
        this.fov.compute(this.player.getX(), this.player.getY(), 5, function(x, y, r, visibility) {
            if(!r) {
                return;
            }
            var posKey = x+","+y;
            var color = (self.map[posKey] ? "#aa0": "#660");
            self.display.draw(x, y, self.map[posKey], "#fff", color);
            var being = self.beingMapLayer[posKey]

            if(being) {
                self.display.draw(being.getX(),being.getY(),being.getToken(),being.getColor(), "#aa0");
            }
        });
    }

    private initiateFov()
    {
        var self = this;
        this.fov = new ROT.FOV.PreciseShadowcasting(function(x, y) {
            var key = x+","+y;
            if (key in self.map) {
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

        var keyMap = {};
        keyMap[ROT.VK_UP] = 0;
        keyMap[ROT.VK_RIGHT] = 1;
        keyMap[ROT.VK_DOWN] = 2;
        keyMap[ROT.VK_LEFT] = 3;

        if (!(code in keyMap)) { return; }

        var diff = ROT.DIRS[4][keyMap[code]];
        var newX = this.player.getX() + diff[0];
        var newY = this.player.getY() + diff[1];

        var newKey = newX + "," + newY;
        if (!(newKey in this.map)) { return; } /* cannot move in direction */

        this.movePlayer(newX, newY);
        this.actionTurns--;
        this.logOnUI("You have "+this.actionTurns+" actions left.");
        this.draw();
    }

    private movePlayer(x, y)
    {
        this.player.setX(x);
        this.player.setY(y);

        this.socket.emit('being-moved', {
            'id': this.player.getId(),
            'x': this.player.getX(),
            'y': this.player.getY()
        });
    }
}