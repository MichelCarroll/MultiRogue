/**
 * Created by michelcarroll on 15-03-22.
 */
/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./Game/Being.ts" />
var Game;
(function (Game) {
    var display;
    var map;
    var beingMapLayer;
    var player;
    var beings;
    var fov;
    var socket;
    var actionTurns;
    var gameArea;
    var socketIo;
    var logOnUI;
    function init(_io, _gameArea, logCallback) {
        socketIo = _io;
        gameArea = _gameArea;
        logOnUI = logCallback;
        initiateSocket();
        hookSocketEvents();
    }
    Game.init = init;
    function initiateSocket() {
        var url = '';
        if (document.location.protocol === 'file:') {
            url = 'http://localhost';
        }
        else {
            url = 'http://' + document.location.hostname;
        }
        socket = socketIo.connect(url + ':3000');
    }
    function hookSocketEvents() {
        socket.on('debug', function (msg) {
            console.log(msg);
        });
        socket.on('initiate-board', function (msg) {
            map = msg.map;
            createBeings(msg.beings);
            socket.emit('position-my-player', {});
        });
        socket.on('position-player', function (msg) {
            createPlayer(msg.player);
            startGame();
        });
        socket.on('being-moved', function (data) {
            var being = beings[parseInt(data.id)];
            if (!being) {
                createBeing(data);
            }
            else {
                moveBeing(being, parseInt(data.x), parseInt(data.y));
            }
            draw();
        });
        socket.on('being-came', function (data) {
            createBeing(data);
            draw();
            logOnUI("Player #" + data.id + " just connected");
        });
        socket.on('being-left', function (data) {
            deleteBeing(parseInt(data.id));
            draw();
            logOnUI("Player #" + data.id + " just disconnected");
        });
        socket.on('its-your-turn', function (msg) {
            actionTurns = parseInt(msg.turns);
            logOnUI("It's your turn. You have " + actionTurns + " actions left.");
        });
    }
    function deleteBeing(id) {
        var being = beings[id];
        if (being) {
            var posKey = being.getX() + ',' + being.getY();
            if (beingMapLayer[posKey] === being) {
                delete beingMapLayer[posKey];
            }
            delete beings[id];
        }
    }
    function moveBeing(being, x, y) {
        var posKey = being.getX() + ',' + being.getY();
        delete beingMapLayer[posKey];
        being.setX(x);
        being.setY(y);
        var posKey = being.getX() + ',' + being.getY();
        beingMapLayer[posKey] = being;
    }
    function createBeings(serializedBeings) {
        beings = new Array();
        beingMapLayer = {};
        for (var i in serializedBeings) {
            if (serializedBeings.hasOwnProperty(i)) {
                createBeing(serializedBeings[i]);
            }
        }
    }
    function createBeing(serializedBeing) {
        var being = Being.fromSerialization(serializedBeing);
        beings[being.getId()] = being;
        beingMapLayer[being.getX() + ',' + being.getY()] = being;
    }
    function startGame() {
        display = new ROT.Display();
        gameArea.append(display.getContainer());
        initiateFov();
        draw();
        window.addEventListener("keydown", handlePlayerEvent);
    }
    function draw() {
        display.clear();
        drawMap();
        drawPlayer();
    }
    function drawPlayer() {
        display.draw(player.getX(), player.getY(), player.getToken(), player.getColor(), "#aa0");
    }
    function createPlayer(data) {
        player = Being.fromSerialization(data);
    }
    function drawMap() {
        fov.compute(player.getX(), player.getY(), 5, function (x, y, r, visibility) {
            if (!r) {
                return;
            }
            var posKey = x + "," + y;
            var color = (map[posKey] ? "#aa0" : "#660");
            display.draw(x, y, map[posKey], "#fff", color);
            var being = beingMapLayer[posKey];
            if (being) {
                display.draw(being.getX(), being.getY(), being.getToken(), being.getColor(), "#aa0");
            }
        });
    }
    function initiateFov() {
        fov = new ROT.FOV.PreciseShadowcasting(function (x, y) {
            var key = x + "," + y;
            if (key in map) {
                return true;
            }
            return false;
        });
    }
    function handlePlayerEvent(e) {
        if (!actionTurns) {
            logOnUI("It's not your turn yet!");
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
        if (!(code in keyMap)) {
            return;
        }
        var diff = ROT.DIRS[4][keyMap[code]];
        var newX = player.getX() + diff[0];
        var newY = player.getY() + diff[1];
        var newKey = newX + "," + newY;
        if (!(newKey in map)) {
            return;
        } /* cannot move in direction */
        movePlayer(newX, newY);
        actionTurns--;
        logOnUI("You have " + actionTurns + " actions left.");
        draw();
    }
    function movePlayer(x, y) {
        player.setX(x);
        player.setY(y);
        socket.emit('being-moved', {
            'id': player.getId(),
            'x': player.getX(),
            'y': player.getY()
        });
    }
})(Game || (Game = {}));
//# sourceMappingURL=Game.js.map