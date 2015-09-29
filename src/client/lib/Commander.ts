/**
 * Created by michelcarroll on 15-04-03.
 */

/// <reference path="../../../definitions/rot.d.ts"/>

import UIAdapter = require('./UIAdapter');
import GameObject = require('../../common/GameObject');
import Playable = require('../../common/Components/Playable');
import Level = require('./Level');
import DisplayAdapter = require('./DisplayAdapter');
import BeingCommand = require('./PlayerCommand');
import Command = require('./Command');
import GameObjectLayer = require('../../common/GameObjectLayer');
import Message = require('../../common/Message');
import MessageClient = require('./MessageClient');
import Context = require('./Context');

class Commander {

    private context:Context;

    constructor(context:Context) {
        this.context = context;
    }

    private inject(command:any)
    {
        if(command.setGameObjectLayer) {
            command.setGameObjectLayer(this.context.level.getGameObjectLayer());
        }
        if(command.setLevel) {
            command.setLevel(this.context.level);
        }
        if(command.setPlayer) {
            command.setPlayer(this.context.player);
        }
        if(command.setMessageClient) {
            command.setMessageClient(this.context.messageClient);
        }
        if(command.setUIAdapter) {
            command.setUIAdapter(this.context.uiAdapter);
        }
    }

    private getRemainingTurns() {
        return this.context.player.getPlayableComponent().getRemainingTurns();
    }

    public executeCommand(command:Command)
    {
        this.inject(command);

        if(command.getTurnsRequired() > 0) {
            if(!this.getRemainingTurns()) {
                this.context.uiAdapter.logOnUI("It's not your turn!");
                return;
            }
            else if(this.getRemainingTurns() - command.getTurnsRequired() < 0) {
                this.context.uiAdapter.logOnUI("You don't have enough turns to do this!");
                return;
            }
        }

        if(!command.canExecute()) {
            this.context.uiAdapter.logOnUI("You can't do that!");
            return;
        }
        command.execute();

        if(command.getTurnsRequired() > 0) {
            if (this.getRemainingTurns() <= 0) {
                this.context.uiAdapter.logOnUI("Your turn is over.");
            }
        }

        this.context.displayAdapter.draw();
    }
}

export = Commander;