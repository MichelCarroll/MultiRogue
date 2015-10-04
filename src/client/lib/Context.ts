
import MessageClient = require('../../common/MessageClient');
import GameObject = require('../../common/GameObject');
import GameObjectLayer = require('../../common/GameObjectLayer');

import UIAdapter = require('./UIAdapter');
import DisplayAdapter = require('./DisplayAdapter');


class Context {
    private uiAdapter:UIAdapter;
    private messageClient:MessageClient;
    private player:GameObject;
    private displayAdapter:DisplayAdapter;
    private goLayer:GameObjectLayer;

    public setGameObjectLayer(a:GameObjectLayer) {
        this.goLayer = a;
    }

    public setDisplayAdapter(a:DisplayAdapter) {
        this.displayAdapter = a;
    }

    public setMessageClient(a:MessageClient) {
        this.messageClient = a;
    }

    public setPlayer(a:GameObject) {
        this.player = a;
    }

    public setUIAdapter(a:UIAdapter) {
        this.uiAdapter = a;
    }

    public getGameObjectLayer():GameObjectLayer {
        return this.goLayer;
    }

    public getDisplayAdapter():DisplayAdapter {
        return this.displayAdapter;
    }

    public getMessageClient():MessageClient {
        return this.messageClient;
    }

    public getPlayer():GameObject {
        return this.player;
    }

    public getUIAdapter():UIAdapter {
        return this.uiAdapter;
    }
}

export = Context;