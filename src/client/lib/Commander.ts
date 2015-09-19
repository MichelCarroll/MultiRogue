/**
 * Created by michelcarroll on 15-04-03.
 */

/// <reference path="../../../definitions/rot.d.ts"/>

import UIAdapter = require('./UIAdapter');
import Player = require('./Player');
import Board = require('./Board');
import Level = require('./Level');
import DisplayAdapter = require('./DisplayAdapter');
import PlayerCommand = require('./PlayerCommand');
import Message = require('../../common/Message');
import MessageClient = require('./MessageClient');

class Commander {

    private uiAdapter:UIAdapter;
    private messageClient:MessageClient;
    private player:Player;
    private map:Board;
    private level:Level;
    private displayAdapter:DisplayAdapter;

    constructor(uiAdapter:UIAdapter, messageClient:MessageClient, player:Player, level:Level, map:Board, displayAdapter:DisplayAdapter) {
        this.uiAdapter = uiAdapter;
        this.messageClient = messageClient;
        this.player = player;
        this.level = level;
        this.displayAdapter = displayAdapter;
        this.map = map;
    }

    public inputChat(text)
    {
        var self = this;
        var chatCommand = new PlayerCommand(1, function() {
            self.uiAdapter.logOnUI("You shout \""+text+"\"!!");
            self.messageClient.send(new Message('shout', {
                'text': text
            }));
            return true;
        });

        this.executeCommand(chatCommand);
    }

    public clickItem(goId:number) {
        var command = new PlayerCommand(1, this.getDropCommand(goId));
        this.executeCommand(command);
    }

    public pressKey(keyCode:number)
    {
        var command = this.getKeyCommandMap()[keyCode];
        if(command) {
            this.executeCommand(command);
        }
    }

    private getMoveCommand(x:number, y:number) {
        var self = this;
        return function() {
            var coord = self.player.getPosition().add(x, y);
            if(!self.map.tileExists(coord)) {
                return false;
            }
            if(!self.level.move(self.player, coord)) {
                return false;
            }
            self.messageClient.send(new Message('being-moved', {
                'id': self.player.getId(),
                'x': self.player.getPosition().x,
                'y': self.player.getPosition().y
            }));
            return true;
        };
    }

    private getLookAtFloorCommand() {
        var self = this;
        return function() {
            var go = self.level.getTopGroundObject(self.player.getPosition());
            if(!go) {
                return false;
            }
            self.uiAdapter.logOnUI("You see "+go.getDescription()+".");
            self.messageClient.send(new Message('being-looked-at-floor', {
                'id': self.player.getId()
            }));
            return true;
        }
    }

    private getDropCommand(goId:number) {
        var self = this;
        return function() {
            var go = self.player.getInventory()[goId];
            if(!go) {
                return false;
            }
            self.level.dropByPlayer(go, self.player);
            self.uiAdapter.logOnUI("You drop the "+go.getName()+".");
            self.uiAdapter.removeItemFromUI(go.getId());
            self.messageClient.send(new Message('being-dropped', {
                'playerId': self.player.getId(),
                'objectId': go.getId()
            }));
            return true;
        }
    }

    private getPickUpCommand() {
        var self = this;
        return function() {
            var go = self.level.getTopItem(self.player.getPosition());
            if(!go) {
                return false;
            }
            self.level.pickUpByPlayer(go, self.player);
            self.uiAdapter.logOnUI("You pick up the "+go.getName()+".");
            self.uiAdapter.addItemToUI(go.getId(), go.getName());
            self.messageClient.send(new Message('being-picked-up', {
                'playerId': self.player.getId(),
                'objectId': go.getId()
            }));
            return true;
        }
    }

    private getKeyCommandMap()
    {
        var map = {};
        map[ROT.VK_UP] =    new PlayerCommand(1, this.getMoveCommand(0, -1));
        map[ROT.VK_RIGHT] = new PlayerCommand(1, this.getMoveCommand(1,  0));
        map[ROT.VK_DOWN] =  new PlayerCommand(1, this.getMoveCommand(0,  1));
        map[ROT.VK_LEFT] =  new PlayerCommand(1, this.getMoveCommand(-1, 0));
        map[ROT.VK_PERIOD]= new PlayerCommand(1, this.getLookAtFloorCommand());
        map[ROT.VK_K]=      new PlayerCommand(1, this.getPickUpCommand());
        return map;
    }

    private executeCommand(playerCommand:PlayerCommand)
    {
        if(!this.player.getRemainingActionTurns()) {
            this.uiAdapter.logOnUI("It's not your turn!");
            return;
        }
        else if(this.player.getRemainingActionTurns() - playerCommand.getTurnCost() < 0) {
            this.uiAdapter.logOnUI("You don't have enough turns to do this!");
            return;
        }

        if(!playerCommand.execute()) {
            this.uiAdapter.logOnUI("You can't do that!");
            return;
        }

        this.player.useTurns(playerCommand.getTurnCost());

        if(this.player.getRemainingActionTurns() > 0) {
            this.uiAdapter.logOnUI("You have "+this.player.getRemainingActionTurns()+" actions left.");
        } else {
            this.uiAdapter.logOnUI("Your turn is over.");
        }

        this.displayAdapter.draw();
    }
}

export = Commander;