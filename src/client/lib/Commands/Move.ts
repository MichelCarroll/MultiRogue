
import Command = require('../Command');
import Being = require('../../../common/Being');
import Board = require('../../../common/Board');
import Level = require('../Level');
import MessageClient = require('../MessageClient');
import Message = require('../../../common/Message');
import Vector2D = require('../../../common/Vector2D');

import ServerAware = require('../IOC/ServerAware');
import PlayerAware = require('../IOC/PlayerAware');
import LevelAware = require('../IOC/LevelAware');
import BoardAware = require('../IOC/BoardAware');

class Move implements Command, ServerAware, BoardAware, PlayerAware, LevelAware {

    private direction:Vector2D;
    private player:Being;
    private board:Board;
    private level:Level;
    private messageClient:MessageClient;

    constructor(direction:Vector2D) {
        this.direction = direction;
    }

    public setMessageClient(messageClient:MessageClient) {
        this.messageClient = messageClient;
    }

    public setBoard(board:Board) {
        this.board = board;
    }

    public setLevel(level:Level) {
        this.level = level;
    }

    public setPlayer(player:Being) {
        this.player = player;
    }

    public getTurnsRequired():number {
        return 1;
    }

    public canExecute():boolean {
        var coord = this.player.getPosition().addVector(this.direction);
        if(!this.board.tileExists(coord)) {
            return false;
        }
        if(!this.level.canMoveTo(coord)) {
            return false;
        }
        return true;
    }

    public execute() {
        var coord = this.player.getPosition().addVector(this.direction);
        this.level.move(this.player, coord);
        this.messageClient.send(new Message('being-moved', {
            'id': this.player.getId(),
            'x': coord.x,
            'y': coord.y
        }));
    }
}

export = Move;