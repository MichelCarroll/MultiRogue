
import Being = require('./Being');

class Player {

    private being:Being;
    private callToAction:()=>void;
    private turns:number;

    constructor(being, callToAction) {
        this.being = being;
        this.callToAction = callToAction;
        this.turns = 0;
    }

    public getBeing():Being {
        return this.being;
    }

    public askToTakeTurn() {
        this.callToAction();
    }

    public giveTurns(turns:number) {
        this.turns += turns;
    }

    public spendTurns(turns:number) {
        this.turns = Math.max(this.turns - turns, 0);
    }

    public getRemainingTurns() {
        return this.turns;
    }
}

export = Player;