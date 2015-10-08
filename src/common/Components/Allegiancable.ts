
import Component = require('../Component');

class Allegiancable extends Component {

    private name:string;

    public setProperties(data:any) {
        this.name = data.name;
    }

    public getName():string {
        return this.name;
    }

    public serialize():any {
        return {
            name: this.name
        };
    }

    public deserialize(data:any) {
        this.name = data.name;
    }

    public getComponentKey():string {
        return 'Allegiancable';
    }
}

export = Allegiancable;