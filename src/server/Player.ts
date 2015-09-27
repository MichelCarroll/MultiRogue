
import GameObject = require('./../common/GameObject');

class Player {

    private being:GameObject;
    private callToAction:()=>void;

    constructor(being, callToAction) {
        this.being = being;
        this.callToAction = callToAction;
    }

    public getBeing():GameObject {
        return this.being;
    }

    public askToTakeTurn() {
        this.callToAction();
    }
}

export = Player;