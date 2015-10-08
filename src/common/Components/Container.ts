
import Component = require('../Component');
import Map = require('../Map');
import GameObject = require('../GameObject');

class Container extends Component {

    protected inventory:Map<GameObject>;

    constructor() {
        super();
        this.inventory = new Map<GameObject>();
    }

    public getComponentKey():string {
        return 'Container';
    }

    public addToInventory(go:GameObject) {
        if(!go.isContent()) {
            throw new Error('Can\'t hold this item');
        }
        this.inventory.set(go.getId(), go);
    }

    public removeFromInventory(go:GameObject) {
        this.inventory.delete(go.getId());
    }

    public getInventory():Map<GameObject> {
        return this.inventory;
    }

    public serialize():any {
        return {
            inventory: this.inventory.serialize()
        };
    }

    public deserialize(data:any) {
        this.inventory.deserialize(data.inventory);
    }
}

export = Container;