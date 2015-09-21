
import Command = require('../Command');
import Player = require('../Player');
import Board = require('../Board');
import Level = require('../Level');
import MessageClient = require('../MessageClient');
import Message = require('../../../common/Message');
import Vector2D = require('../../../common/Vector2D');

class Move implements Command {

    private direction:Vector2D;
    private player:Player;
    private map:Board;
    private level:Level;
    private messageClient:MessageClient;

    constructor(direction:Vector2D, player, map, level, messageClient) {
        this.direction = direction;
        this.player = player;
        this.map = map;
        this.level = level;
        this.messageClient = messageClient;
    }

    public getTurnsRequired():number {
        return 1;
    }

    public canExecute():boolean {
        var coord = this.player.getPosition().addVector(this.direction);
        if(!this.map.tileExists(coord)) {
            return false;
        }
        if(!this.level.canMoveTo(coord)) {
            return false;
        }
        return true;
    }

    public execute() {
        this.messageClient.send(new Message('being-moved', {
            'id': this.player.getId(),
            'x': this.player.getPosition().x,
            'y': this.player.getPosition().y
        }));
    }
}

export = Move;