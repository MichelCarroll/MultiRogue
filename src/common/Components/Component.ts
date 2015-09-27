
import GameObject = require('../GameObject');
import Serializable = require('../Serializable');

class Component implements Serializable {

    protected target;

    public setTarget(target:GameObject) {
        this.target = target;
    }

    public setProperties(data:any) {

    }

    public getComponentKey():string {
        return '';
    }

    public serialize():any {

    }

    public deserialize(data:any) {

    }

}

export = Component;