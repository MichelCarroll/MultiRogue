
import GameObject = require('./GameObject');
import Serializable = require('./Serializable');

interface Effect extends Serializable {

    apply(target:GameObject);
    getFeedbackMessage(target:GameObject):string;

}

declare var Effect; //make IDE stop complaining

export = Effect;