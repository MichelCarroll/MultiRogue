/**
 * Created by michelcarroll on 15-04-03.
 */

/// <reference path="../../../definitions/rot.d.ts"/>

import UIAdapter = require('./UIAdapter');
import GameObject = require('../../common/GameObject');
import Board = require('../../common/Board');
import Playable = require('../../common/Components/Playable');
import Level = require('./Level');
import DisplayAdapter = require('./DisplayAdapter');
import BeingCommand = require('./PlayerCommand');
import Command = require('./Command');
import Message = require('../../common/Message');
import MessageClient = require('./MessageClient');

class Commander {

    private uiAdapter:UIAdapter;
    private messageClient:MessageClient;
    private player:GameObject;
    private map:Board;
    private level:Level;
    private displayAdapter:DisplayAdapter;

    constructor(uiAdapter:UIAdapter, messageClient:MessageClient, player:GameObject, level:Level, map:Board, displayAdapter:DisplayAdapter) {
        this.uiAdapter = uiAdapter;
        this.messageClient = messageClient;
        this.player = player;
        this.level = level;
        this.displayAdapter = displayAdapter;
        this.map = map;
    }

    private inject(command:any)
    {
        if(command.setBoard) {
            command.setBoard(this.map);
        }
        if(command.setLevel) {
            command.setLevel(this.level);
        }
        if(command.setPlayer) {
            command.setPlayer(this.player);
        }
        if(command.setMessageClient) {
            command.setMessageClient(this.messageClient);
        }
        if(command.setUIAdapter) {
            command.setUIAdapter(this.uiAdapter);
        }
    }

    public executeCommand(command:Command)
    {
        this.inject(command);

        if(!(<Playable>this.player.getComponent('Playable')).getRemainingTurns()) {
            this.uiAdapter.logOnUI("It's not your turn!");
            return;
        }
        else if((<Playable>this.player.getComponent('Playable')).getRemainingTurns() - command.getTurnsRequired() < 0) {
            this.uiAdapter.logOnUI("You don't have enough turns to do this!");
            return;
        }

        if(!command.canExecute()) {
            this.uiAdapter.logOnUI("You can't do that!");
            return;
        }
        command.execute();

        (<Playable>this.player.getComponent('Playable')).spendTurns(command.getTurnsRequired());

        if((<Playable>this.player.getComponent('Playable')).getRemainingTurns() > 0) {
            this.uiAdapter.logOnUI("You have "+(<Playable>this.player.getComponent('Playable')).getRemainingTurns()+" actions left.");
        } else {
            this.uiAdapter.logOnUI("Your turn is over.");
        }

        this.displayAdapter.draw();
    }
}

export = Commander;