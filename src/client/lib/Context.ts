
import MessageClient = require('../../common/MessageClient');
import GameObject = require('../../common/GameObject');

import UIAdapter = require('./UIAdapter');
import Level = require('./Level');
import DisplayAdapter = require('./DisplayAdapter');


class Context {
    private uiAdapter:UIAdapter;
    private messageClient:MessageClient;
    private player:GameObject;
    private level:Level;
    private displayAdapter:DisplayAdapter;

    public setDisplayAdapter(a:DisplayAdapter) {
        this.displayAdapter = a;
    }

    public setMessageClient(a:MessageClient) {
        this.messageClient = a;
    }

    public setPlayer(a:GameObject) {
        this.player = a;
    }

    public setLevel(a:Level) {
        this.level = a;
    }

    public setUIAdapter(a:UIAdapter) {
        this.uiAdapter = a;
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

    public getLevel():Level {
        return this.level;
    }

    public getUIAdapter():UIAdapter {
        return this.uiAdapter;
    }
}

export = Context;