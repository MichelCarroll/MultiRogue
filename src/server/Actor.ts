
import GameObject = require('./../common/GameObject');

class Actor {

    private _isPlayer:boolean;
    private being:GameObject;
    private callToAction:()=>void;

    constructor(being, callToAction, isPlayer) {
        this.being = being;
        this.callToAction = callToAction;
        this._isPlayer = isPlayer;
    }

    public isPlayer():boolean {
        return this._isPlayer;
    }

    public getBeing():GameObject {
        return this.being;
    }

    public askToTakeTurn() {
        this.callToAction();
    }
}

export = Actor;