/**
 * Created by michelcarroll on 15-03-28.
 */

class PlayerCommand {

    private turnCost:number;
    private executeCallback:() => boolean;

    constructor(turnCost:number, executeCallback:() => boolean) {
        this.turnCost = turnCost;
        this.executeCallback = executeCallback;
    }

    public getTurnCost():number {
        return this.turnCost;
    }

    public execute():boolean {
        return this.executeCallback();
    }
}

export = PlayerCommand;