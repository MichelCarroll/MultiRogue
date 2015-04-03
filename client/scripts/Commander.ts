/**
 * Created by michelcarroll on 15-04-03.
 */

/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./PlayerCommand.ts" />
/// <reference path="./UIAdapter.ts" />
/// <reference path="./Player.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./GameObjectRepository.ts" />
/// <reference path="./DisplayAdapter.ts" />


interface Socket {
    on(event: string, callback: (data: any) => void );
    emit(event: string, data: any);
}

module Herbs {
    export class Commander {

        private uiAdapter:UIAdapter;
        private socket:Socket;
        private player:Player;
        private map:Board;
        private goRepository:GameObjectRepository;
        private displayAdapter:DisplayAdapter;

        constructor(uiAdapter:UIAdapter, socket:Socket, player:Player, goRepository:GameObjectRepository, map:Board, displayAdapter:DisplayAdapter) {
            this.uiAdapter = uiAdapter;
            this.socket = socket;
            this.player = player;
            this.goRepository = goRepository;
            this.displayAdapter = displayAdapter;
            this.map = map;
        }

        public inputChat(text)
        {
            var self = this;
            var chatCommand = new PlayerCommand(1, function() {
                self.uiAdapter.logOnUI("You shout \""+text+"\"!!");
                self.socket.emit('shout', {
                    'text': text
                });
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
                if(!self.goRepository.move(self.player, coord)) {
                    return false;
                }
                self.socket.emit('being-moved', {
                    'id': self.player.getId(),
                    'x': self.player.getPosition().x,
                    'y': self.player.getPosition().y
                });
                return true;
            };
        }

        private getLookAtFloorCommand() {
            var self = this;
            return function() {
                var go = self.goRepository.getTopGroundObject(self.player.getPosition());
                if(!go) {
                    return false;
                }
                self.uiAdapter.logOnUI("You see "+go.getDescription()+".");
                self.socket.emit('being-looked-at-floor', {
                    'id': self.player.getId()
                });
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
                self.goRepository.dropByPlayer(go, self.player);
                self.uiAdapter.logOnUI("You drop the "+go.getName()+".");
                self.uiAdapter.removeItemFromUI(go.getId());
                self.socket.emit('being-dropped', {
                    'playerId': self.player.getId(),
                    'objectId': go.getId()
                });
                return true;
            }
        }

        private getPickUpCommand() {
            var self = this;
            return function() {
                var go = self.goRepository.getTopItem(self.player.getPosition());
                if(!go) {
                    return false;
                }
                self.goRepository.pickUpByPlayer(go, self.player);
                self.uiAdapter.logOnUI("You pick up the "+go.getName()+".");
                self.uiAdapter.addItemToUI(go.getId(), go.getName());
                self.socket.emit('being-picked-up', {
                    'playerId': self.player.getId(),
                    'objectId': go.getId()
                });
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
}