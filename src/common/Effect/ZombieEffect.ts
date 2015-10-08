

import Effect from '../Effect';
import GameObject = require('../GameObject');

class ZombieEffect implements Effect {

    public apply(target:GameObject) {
        target.setName('Zombie');
    }

    public getFeedbackMessage(target:GameObject):string {
        return 'You turn into a zombie!';
    }

    public serialize():any {
        return {};
    }

    public deserialize(data:any) {

    }

}

export = ZombieEffect;