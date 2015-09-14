/**
 * Created by michelcarroll on 15-03-31.
 */

/// <reference path="../definitions/rot.d.ts"/>

import Player = require('./Player');
import UIAdapter = require('./UIAdapter');
import Board = require('./Board');
import Coordinate = require('./Coordinate');
import GameObjectLayer = require('./GameObjectLayer');

class DisplayAdapter {

    private uiAdapter:UIAdapter;
    private map:Board;
    private player:Player;
    private goLayer:GameObjectLayer;
    private display:ROT.Display;
    private fov:ROT.FOV.PreciseShadowcasting;

    constructor(uiAdapter:UIAdapter) {
        this.uiAdapter = uiAdapter;
    }

    public reinitialize(map:Board, player:Player, goLayer:GameObjectLayer) {
        this.map = map;
        this.player = player;
        this.goLayer = goLayer;
        this.recreateGameDisplay();
        this.initiateFov();
        this.draw();
    }

    public resize() {
        if(!this.map) {
            return;
        }

        this.recreateGameDisplay();
        this.draw();
    }

    public draw() {
        if(!this.map) {
            return;
        }

        this.display.clear();
        this.drawBoard();
        this.drawPlayer();
    }

    public clear() {
        this.uiAdapter.clearGameDisplay();
    }

    private drawPlayer()
    {
        this.display.draw(this.player.getPosition().x,this.player.getPosition().y ,this.player.getToken(),this.player.getColor(), "#aa0");
    }

    private drawBoard()
    {
        var self = this;
        this.fov.compute(this.player.getPosition().x,this.player.getPosition().y, 5, function(x, y, r, visibility) {
            if(!r) {
                return;
            }
            var coord = new Coordinate(x,y);
            var color = (self.map.tileExists(coord) ? "#aa0": "#660");
            self.display.draw(x, y, self.map.getTile(coord), "#fff", color);
            var being = self.goLayer.getTopGameObject(coord);

            if(being) {
                self.display.draw(being.getPosition().x,being.getPosition().y,being.getToken(),being.getColor(), "#aa0");
            }
        });

    }

    private initiateFov()
    {
        var self = this;
        this.fov = new ROT.FOV.PreciseShadowcasting(function(x, y) {
            if(self.map.tileExists(new Coordinate(x,y))) {
                return true;
            }
            return false;
        });
    }

    private recreateGameDisplay()
    {
        this.uiAdapter.clearGameDisplay();

        this.display = new ROT.Display({
            width: this.map.getWidth(),
            height: this.map.getHeight(),
            fontSize: this.uiAdapter.getBestFontSize(
                this.map.getWidth(),
                this.map.getHeight()
            )
        });

        this.uiAdapter.setGameCanvas(this.display.getContainer());
    }

}

export = DisplayAdapter;