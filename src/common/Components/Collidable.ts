
import Component = require('./Component');

class Collidable extends Component {

    public getComponentKey():string {
        return 'Collidable';
    }
}

export = Collidable;