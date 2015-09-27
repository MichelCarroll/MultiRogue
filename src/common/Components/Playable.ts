
import Component = require('./Component');

class Playable extends Component {

    private actionTurns:number = 0;

    public setProperties(data:any) {
        this.actionTurns = data.token;
    }

    public getComponentKey():string {
        return 'Playable';
    }

    public getToken():number {
        return this.actionTurns;
    }

    public giveTurns(turns:number) {
        this.actionTurns += turns;
    }

    public spendTurns(turns:number) {
        this.actionTurns = Math.max(this.actionTurns - turns, 0);
    }

    public getRemainingTurns() {
        return this.actionTurns;
    }

    public serialize():any {
        return {
            actionTurns: this.actionTurns
        };
    }

    public deserialize(data:any) {
        this.actionTurns = data.actionTurns;
    }
}

export = Playable;