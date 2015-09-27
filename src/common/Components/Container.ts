
import Component = require('./Component');
import Repository = require('../Repository');
import GameObject = require('../GameObject');

class Container extends Component {

    protected inventory:Repository<GameObject>;

    constructor() {
        super();
        this.inventory = new Repository<GameObject>();
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

    public getInventory():Repository<GameObject> {
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