/**
 * Created by michelcarroll on 15-03-31.
 */

/// <reference path="../../../definitions/rot.d.ts"/>

import Player = require('./Player');
import UIAdapter = require('./UIAdapter');
import Board = require('./Board');
import Vector2D = require('./Vector2D');
import GameObjectLayer = require('./GameObjectLayer');

class DisplayAdapter {

    private uiAdapter:UIAdapter;
    private map:Board;
    private player:Player;
    private goLayer:GameObjectLayer;


    constructor(uiAdapter:UIAdapter) {
        this.uiAdapter = uiAdapter;
    }

    public reinitialize(map:Board, player:Player, goLayer:GameObjectLayer) {
        this.map = map;
        this.player = player;
        this.goLayer = goLayer;

        this.recreateGameDisplay();
        this.uiAdapter.drawMap();
    }

    public resize() {
        if(!this.map) {
            return;
        }

        this.recreateGameDisplay();
        this.uiAdapter.drawMap();
    }

    public draw() {
        this.uiAdapter.drawMap();
    }

    public clear() {
        this.uiAdapter.clearMap();
    }


    private recreateGameDisplay()
    {
        var self = this;
        var getCamera = function() {
            return {
                position: self.player.getPosition().copy(),
                range: 5
            };
        }

        var getTileOpacity = function(x:number, y:number) {
            if(self.map.tileExists(new Vector2D(x, y))) {
                return true;
            }
            return false;
        };

        var getTileAppearance = function(coord:Vector2D, r:number) {
            var being = self.goLayer.getTopGameObject(coord);

            if(being) {
                return {
                    position: being.getPosition().copy(),
                    token: being.getToken(),
                    frontColor: being.getColor(),
                    backColor: "#aa0"
                };
            }

            return {
                position: coord,
                token: self.map.getTile(coord),
                frontColor: "#fff",
                backColor: self.map.tileExists(coord) ? "#aa0": "#660"
            };
        };

        this.uiAdapter.clearMap();
        this.uiAdapter.setMapSize(new Vector2D(this.map.getWidth(), this.map.getHeight()));
        this.uiAdapter.setCameraCallback(getCamera.bind(this));
        this.uiAdapter.setTileCallback(getTileAppearance.bind(this));
        this.uiAdapter.setTileOpacityCallback(getTileOpacity.bind(this));

    }

}

export = DisplayAdapter;