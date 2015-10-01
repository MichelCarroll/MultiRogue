
/// <reference path="../../../definitions/rot.d.ts"/>

import Vector2D = require('../../common/Vector2D');

import UIAdapter = require('./UIAdapter');
import Context = require('./Context');
import GameDisplayAdapter = require('./GameDisplayAdapter');

class DisplayAdapter {

    private context:Context;
    private mapSize:Vector2D;

    constructor(context:Context) {
        this.context = context;
    }

    public reinitialize(mapSize:Vector2D) {
        this.mapSize = mapSize;

        this.recreateGameDisplay();
    }

    public resize() {
        if(!this.mapSize) {
            return;
        }

        this.recreateGameDisplay();
    }

    public draw() {
        this.context.getUIAdapter().drawMap();
    }

    public clear() {
        this.context.getUIAdapter().clearMap();
    }

    private recreateGameDisplay()
    {
        var self = this;

        var getTileAppearance = function(coord:Vector2D) {
            var gameObject = self.context.getLevel().getGameObjectLayer().getTopRenderableGameObject(coord);

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

        this.context.getUIAdapter().setGameDisplayAdapter(new GameDisplayAdapter(
            this.mapSize,
            getTileAppearance.bind(this)
        ));
        this.context.getUIAdapter().drawMap();
    }
}

export = DisplayAdapter;