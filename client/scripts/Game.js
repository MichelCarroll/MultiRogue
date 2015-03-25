/**
 * Created by michelcarroll on 15-03-22.
 */
/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./Game/Player.ts" />
var Game;
(function (Game) {
    var display;
    var map;
    var player;
    var engine;
    var ananas;
    var currentActor;
    var fov;
    function init() {
        var socket = io.connect('http://localhost:3000');
        socket.on('debug', function (msg) {
            console.log(msg);
        });
        var scheduler = new ROT.Scheduler.Simple();
        engine = new ROT.Engine(scheduler);
        map = new Array();
        display = new ROT.Display();
        document.body.appendChild(display.getContainer());
        generateMap();
        scheduler.add(player, true);
        initiateFov();
        draw();
        engine.start();
    }
    Game.init = init;
    function draw() {
        display.clear();
        drawMap();
        drawPlayer();
    }
    function drawPlayer() {
        display.draw(player.getX(), player.getY(), player.getToken(), player.getColor());
    }
    function generateMap() {
        var digger = new ROT.Map.Digger();
        var freeCells = [];
        var digCallback = function (x, y, value) {
            if (value) {
                return;
            } /* do not store walls */
            var key = x + "," + y;
            freeCells.push(key);
            map[key] = ".";
        };
        digger.create(digCallback.bind(this));
        generateBoxes(freeCells);
        createPlayer(freeCells);
    }
    function generateBoxes(freeCells) {
        for (var i = 0; i < 10; i++) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
            map[key] = "*";
            if (!i) {
                ananas = key;
            } /* first box contains an ananas */
        }
    }
    ;
    function drawMap() {
        fov.compute(player.getX(), player.getY(), 5, function (x, y, r, visibility) {
            var ch = (r ? map[x + "," + y] : "@");
            var color = (map[x + "," + y] ? "#aa0" : "#660");
            display.draw(x, y, ch, "#fff", color);
        });
    }
    function createPlayer(freeCells) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        player = new Player(x, y, Game.playerAct);
    }
    function playerAct(player) {
        engine.lock();
        currentActor = player;
        window.addEventListener("keydown", handlePlayerEvent);
    }
    Game.playerAct = playerAct;
    function checkBox() {
        var key = currentActor.getX() + "," + currentActor.getY();
        if (map[key] != "*") {
            alert("There is no box here!");
        }
        else if (key == ananas) {
            alert("Hooray! You found an ananas and won this game.");
            window.removeEventListener("keydown", handlePlayerEvent);
            engine.lock();
        }
        else {
            alert("This box is empty :-(");
            window.removeEventListener("keydown", handlePlayerEvent);
            engine.unlock();
        }
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
        var code = e.keyCode;
        if (code == ROT.VK_RETURN || code == ROT.VK_SPACE) {
            checkBox();
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
        currentActor.setX(newX);
        currentActor.setY(newY);
        draw();
        window.removeEventListener("keydown", handlePlayerEvent);
        currentActor = null;
        engine.unlock();
    }
})(Game || (Game = {}));
//# sourceMappingURL=Game.js.map