
import Component = require('../Component');

class Health extends Component {

    private maxHp:number;
    private currentHp:number;

    public setProperties(data:any) {
        this.maxHp = data.maxHp;
        this.currentHp = data.currentHp;
    }

    public reduce(val:number) {
        this.currentHp -= val;
    }

    public restore() {
        this.currentHp = this.maxHp;
    }

    public getMaxHP():number {
        return this.maxHp;
    }

    public getCurrentHP():number {
        return this.currentHp;
    }

    public serialize():any {
        return {
            maxHp: this.maxHp,
            currentHp: this.currentHp
        };
    }

    public deserialize(data:any) {
        this.maxHp = data.maxHp;
        this.currentHp = data.currentHp;
    }

    public getComponentKey():string {
        return 'Health';
    }
}

export = Health;