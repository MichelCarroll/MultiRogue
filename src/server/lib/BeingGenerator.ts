

import Being = require('./Being');

class BeingGenerator {

    private callForTurn:()=>void;

    constructor(callForTurn:()=>void) {
        this.callForTurn = callForTurn;
    }

    public create():Being {
        return new Being(this.callForTurn);
    }

}

export = BeingGenerator;