

import Effect from '../Effect';
import GameObject = require('../GameObject');

class DamageEffect implements Effect {

    private damage:number;

    constructor(damage:number) {
        this.damage = damage;
    }

    public apply(target:GameObject) {
        if(target.isHealthed()) {
            target.getHealthComponent().reduce(this.damage);
        }
    }

    public getFeedbackMessage(target:GameObject):string {
        return 'You take '+this.damage+' damage!';
    }

    public serialize():any {
        return {
            'damage': this.damage
        };
    }

    public deserialize(data:any) {
        this.damage = data.damage;
    }

}

export = DamageEffect;