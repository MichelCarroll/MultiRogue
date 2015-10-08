
import Map  = require('./Map');
import GameObject = require('./GameObject');
import Vector2D  = require('./Vector2D');

class Notifier {

    public container:Map<GameObject>;

    constructor() {
        this.container = new Map<GameObject>();
    }

    public notifyByRadius(message:string, center:Vector2D, radius:number, exceptIds:number[] = []) {
        this.container.getAll().forEach(function(go:GameObject) {
            if(exceptIds.indexOf(go.getId()) !== -1) {
                return;
            }
            if(go.getPosition().distanceFrom(center) <= radius) {
                go.notify(message);
            }
        });
    }

}

export = Notifier;