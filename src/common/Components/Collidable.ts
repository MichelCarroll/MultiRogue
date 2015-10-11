
import Component = require('../Component');
import Serializer = require('../Serializer');
import Effect from '../Effect' ;

class Collidable extends Component {

    private effect:Effect;

    public setProperties(data:any) {
        this.effect = data.effect;
    }

    public getEffect():Effect {
        return this.effect;
    }

    public getComponentKey():string {
        return 'Collidable';
    }

    public serialize():any {
        return {
            effect: Serializer.serialize(this.effect)
        };
    }

    public deserialize(data:any) {
        this.effect = (<Effect>Serializer.deserialize(data.effect));
        this.effect.setSource(this.target);
    }

}

export = Collidable;