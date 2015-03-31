/**
 * Created by michelcarroll on 15-03-22.
 */

/// <reference path="./GameObject.ts" />

module Herbs {
    export class Player extends GameObject {

        private actionTurns;

        constructor(id:number) {
            super(id);
            this.actionTurns = 0;
        }

        public getRemainingActionTurns():number {
            return this.actionTurns;
        }

        public giveTurns(turns:number) {
            this.actionTurns += turns;
        }

        public useTurns(turns:number) {
            this.actionTurns = Math.max(this.actionTurns - turns, 0);
        }

        static fromSerialization(data):Player {
            var player = new Player(parseInt(data.id));
            GameObject.assignSerializedData(player, data);
            return player;
        }
}
}