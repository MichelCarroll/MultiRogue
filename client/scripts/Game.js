/**
 * Created by michelcarroll on 15-03-22.
 */
/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./Game/Player.ts" />
var Game;
(function (Game) {
    var display;
    var map;
    var beingMapLayer;
    var player;
    var beings;
    var engine;
    var currentActor;
    var fov;
    var socket;
    function init() {
        initiateSocket();
    }
    Game.init = init;
    function initiateSocket() {
        socket = io.connect('http://localhost:3000');
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
        socket.on('being-moved', function (msg) {
            var being = beings[parseInt(msg.id)];
            if (!being) {
                createBeing(msg);
            }
            else {
                moveBeing(being, parseInt(msg.x), parseInt(msg.y));
            }
        });
    }
    function moveBeing(being, x, y) {
        var posKey = being.getX() + ',' + being.getY();
        delete beingMapLayer[posKey];
        being.setX(x);
        being.setY(y);
        var posKey = being.getX() + ',' + being.getY();
        beingMapLayer[posKey] = being;
        draw();
    }
    function createBeings(serializedBeings) {
        beings = new Array();
        beingMapLayer = {};
        for (var i in serializedBeings) {
            createBeing(serializedBeings[i]);
        }
    }
    function createBeing(serializedBeing) {
        var being = new Being(parseInt(serializedBeing.id), parseInt(serializedBeing.x), parseInt(serializedBeing.y), function () {
        });
        beings[being.getId()] = being;
        beingMapLayer[being.getX() + ',' + being.getY()] = being;
    }
    function startGame() {
        var scheduler = new ROT.Scheduler.Simple();
        engine = new ROT.Engine(scheduler);
        display = new ROT.Display();
        document.body.appendChild(display.getContainer());
        scheduler.add(player, true);
        initiateFov();
        draw();
        engine.start();
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
        var x = parseInt(data.x);
        var y = parseInt(data.y);
        var id = parseInt(data.id);
        player = new Player(id, x, y, Game.playerAct);
    }
    function drawMap() {
        fov.compute(player.getX(), player.getY(), 5, function (x, y, r, visibility) {
            if (!r) {
                return;
            }
            var color = (map[x + "," + y] ? "#aa0" : "#660");
            display.draw(x, y, map[x + "," + y], "#fff", color);
            var being = beingMapLayer[x + "," + y];
            if (being) {
                display.draw(being.getX(), being.getY(), being.getToken(), being.getColor(), "#aa0");
            }
        });
    }
    function playerAct(player) {
        engine.lock();
        currentActor = player;
        window.addEventListener("keydown", handlePlayerEvent);
    }
    Game.playerAct = playerAct;
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
        var newX = currentActor.getX() + diff[0];
        var newY = currentActor.getY() + diff[1];
        var newKey = newX + "," + newY;
        if (!(newKey in map)) {
            return;
        } /* cannot move in direction */
        movePlayer(newX, newY);
        draw();
        window.removeEventListener("keydown", handlePlayerEvent);
        currentActor = null;
        engine.unlock();
    }
    function movePlayer(x, y) {
        currentActor.setX(x);
        currentActor.setY(y);
        socket.emit('being-moved', {
            'id': player.getId(),
            'x': player.getX(),
            'y': player.getY()
        });
    }
})(Game || (Game = {}));
//# sourceMappingURL=Game.js.map