

import Effect from '../Effect' ;
import GameObject = require('../GameObject');

class DamageEffect implements Effect {

    private damage:number;
    private source:GameObject;

    constructor(damage:number, source:GameObject) {
        this.damage = damage;
        this.source = source;
    }

    public apply(target:GameObject) {
        if (target.isHealthed()) {
            target.getHealthComponent().reduce(this.damage);
        }
    }

    public getFeedbackRadius():number {
        return 5;
    }

    public getObserverFeedbackMessage(target:GameObject):string {
        return target.getName() + ' gets damaged into a zombie by '+this.source.getName()+'!';
    }

    public getSelfFeedbackMessage(target:GameObject):string {
        return 'You damage '+target.getName()+'!';
    }

    public getTargetFeedbackMessage(target:GameObject):string {
        return 'You get damaged by '+this.source.getName()+'!';
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