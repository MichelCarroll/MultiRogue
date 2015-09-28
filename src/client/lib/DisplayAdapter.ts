
/// <reference path="../../../definitions/rot.d.ts"/>

import GameObject = require('../../common/GameObject');
import UIAdapter = require('./UIAdapter');
import Vector2D = require('../../common/Vector2D');
import GameObjectLayer = require('./GameObjectLayer');
import GameDisplayAdapter = require('./GameDisplayAdapter');

class DisplayAdapter {

    private uiAdapter:UIAdapter;
    private mapSize:Vector2D;
    private goLayer:GameObjectLayer;

    constructor(uiAdapter:UIAdapter) {
        this.uiAdapter = uiAdapter;
    }

    public reinitialize(mapSize:Vector2D, goLayer:GameObjectLayer) {
        this.mapSize = mapSize;
        this.goLayer = goLayer;

        this.recreateGameDisplay();
    }

    public resize() {
        if(!this.mapSize) {
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

        var getTileAppearance = function(coord:Vector2D) {
            var gameObject = self.goLayer.getTopRenderableGameObject(coord);

            if(gameObject) {
                return {
                    position: gameObject.getPosition().copy(),
                    token: gameObject.getRenderableComponent().getToken(),
                    frontColor: gameObject.getRenderableComponent().getFrontColorHex(),
                    backColor: "#aa0"
                };
            }

            return {
                position: coord,
                token: '',
                frontColor: '#fff',
                backColor: "#660"
            };
        };

        this.uiAdapter.setGameDisplayAdapter(new GameDisplayAdapter(
            this.mapSize,
            getTileAppearance.bind(this)
        ));
        this.uiAdapter.drawMap();
    }
}

export = DisplayAdapter;