/**
 * Created by michelcarroll on 15-03-31.
 */

/// <reference path="../bower_components/rot.js-TS/rot.d.ts"/>
/// <reference path="./Player.ts" />
/// <reference path="./GameObjectRepository.ts" />
/// <reference path="./UIAdapter.ts" />
/// <reference path="./Board.ts" />
/// <reference path="./Coordinate.ts" />


module Herbs {
    export class DisplayAdapter {

        private uiAdapter:UIAdapter;
        private map:Board;
        private player:Player;
        private goRepository:GameObjectRepository;
        private display:ROT.Display;
        private fov:ROT.FOV.PreciseShadowcasting;

        constructor(uiAdapter:UIAdapter) {
            this.uiAdapter = uiAdapter;
        }

        public reinitialize(map:Board, player:Player, goRepository:GameObjectRepository) {
            this.map = map;
            this.player = player;
            this.goRepository = goRepository;
            this.recreateGameDisplay();
            this.initiateFov();
            this.draw();
        }

        public resize() {
            this.recreateGameDisplay();
            this.draw();
        }

        public draw() {
            if(!this.display) {
                return;
            }
            this.display.clear();
            this.drawBoard();
            this.drawPlayer();
        }

        public clear() {
            this.uiAdapter.clearGameDisplay();
        }

        private drawPlayer()
        {
            this.display.draw(this.player.getPosition().x,this.player.getPosition().y ,this.player.getToken(),this.player.getColor(), "#aa0");
        }

        private drawBoard()
        {
            var self = this;
            this.fov.compute(this.player.getPosition().x,this.player.getPosition().y, 5, function(x, y, r, visibility) {
                if(!r) {
                    return;
                }
                var coord = new Coordinate(x,y);
                var color = (self.map.tileExists(coord) ? "#aa0": "#660");
                self.display.draw(x, y, self.map.getTile(coord), "#fff", color);
                var being = self.goRepository.getTopGameObjectOnStack(coord);

                if(being) {
                    self.display.draw(being.getPosition().x,being.getPosition().y,being.getToken(),being.getColor(), "#aa0");
                }
            });

        }

        private initiateFov()
        {
            var self = this;
            this.fov = new ROT.FOV.PreciseShadowcasting(function(x, y) {
                if(self.map.tileExists(new Coordinate(x,y))) {
                    return true;
                }
                return false;
            });
        }

        private recreateGameDisplay()
        {
            this.uiAdapter.clearGameDisplay();

            this.display = new ROT.Display({
                width: this.map.getWidth(),
                height: this.map.getHeight(),
                fontSize: this.uiAdapter.getBestFontSize(
                    this.map.getWidth(),
                    this.map.getHeight()
                )
            });

            this.uiAdapter.setGameCanvas(this.display.getContainer());
        }

    }
}