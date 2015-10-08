

import Effect from '../Effect' ;
import GameObject = require('../GameObject');

class BumpEffect implements Effect {

    private source:GameObject;

    constructor(source:GameObject) {
        this.source = source;
    }

    public apply(target:GameObject) {

    }

    public getFeedbackRadius():number {
        return 2;
    }

    public getObserverFeedbackMessage(target:GameObject):string {
        return this.source.getName() + ' bumps into '+ target.getName();
    }

    public getSelfFeedbackMessage(target:GameObject):string {
        return 'You bump into '+target.getName();
    }

    public getTargetFeedbackMessage(target:GameObject):string {
        return this.source.getName()+' bumps into you';
    }

    public serialize():any {
        return {};
    }

    public deserialize(data:any) {

    }

}

export = BumpEffect;