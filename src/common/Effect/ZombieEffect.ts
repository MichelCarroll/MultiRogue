

import Effect from '../Effect' ;
import GameObject = require('../GameObject');

class ZombieEffect implements Effect {

    private source:GameObject;

    public setSource(source:GameObject) {
        this.source = source;
    }

    public apply(target:GameObject) {
        target.setName('Zombie');
    }

    public getFeedbackRadius():number {
        return 5;
    }

    public getObserverFeedbackMessage(target:GameObject):string {
        return target.getName() + ' gets turned into a zombie by '+this.source.getName()+'!';
    }

    public getSelfFeedbackMessage(target:GameObject):string {
        return 'You turn '+target.getName()+' into a zombie!';
    }

    public getTargetFeedbackMessage(target:GameObject):string {
        return this.source.getName()+ ' turns you into a zombie!';
    }

    public serialize():any {
        return {};
    }

    public deserialize(data:any) {

    }

}

export = ZombieEffect;