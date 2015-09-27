
import Being = require('./../common/Being');

class Player {

    private being:Being;
    private callToAction:()=>void;

    constructor(being, callToAction) {
        this.being = being;
        this.callToAction = callToAction;
    }

    public getBeing():Being {
        return this.being;
    }

    public askToTakeTurn() {
        this.callToAction();
    }
}

export = Player;