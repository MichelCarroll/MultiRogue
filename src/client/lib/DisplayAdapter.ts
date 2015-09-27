
/// <reference path="../../../definitions/rot.d.ts"/>

import Being = require('../../common/GameObject');
import UIAdapter = require('./UIAdapter');
import Board = require('../../common/Board');
import Renderable = require('../../common/Components/Renderable');
import Vector2D = require('../../common/Vector2D');
import GameObjectLayer = require('./GameObjectLayer');
import GameDisplayAdapter = require('./GameDisplayAdapter');

class DisplayAdapter {

    private uiAdapter:UIAdapter;
    private map:Board;
    private player:Being;
    private goLayer:GameObjectLayer;


    constructor(uiAdapter:UIAdapter) {
        this.uiAdapter = uiAdapter;
    }

    public reinitialize(map:Board, player:Being, goLayer:GameObjectLayer) {
        this.map = map;
        this.player = player;
        this.goLayer = goLayer;

        this.recreateGameDisplay();
    }

    public resize() {
        if(!this.map) {
            return;
        }

        this.recreateGameDisplay();
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

        var getTileAppearance = function(coord:Vector2D) {
            var gameObject = self.goLayer.getTopGameObject(coord);

            if(gameObject) {
                return {
                    position: gameObject.getPosition().copy(),
                    token: (<Renderable>gameObject.getComponent('Renderable')).getToken(),
                    frontColor: (<Renderable>gameObject.getComponent('Renderable')).getFrontColorHex(),
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

        this.uiAdapter.setGameDisplayAdapter(new GameDisplayAdapter(
            new Vector2D(this.map.getWidth(), this.map.getHeight()),
            getCamera.bind(this),
            getTileAppearance.bind(this),
            getTileOpacity.bind(this)
        ));
        this.uiAdapter.drawMap();

    }

}

export = DisplayAdapter;