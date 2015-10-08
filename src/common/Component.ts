
import GameObject = require('./GameObject');
import Serializable from './Serializable';

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
        return {};
    }

    public deserialize(data:any) {

    }

}

export = Component;