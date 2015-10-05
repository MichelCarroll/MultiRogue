
import GameObject = require('./GameObject');
import Serializable = require('./Serializable');

interface Effect extends Serializable {

    apply(target:GameObject);
    getFeedbackMessage(target:GameObject):string;

}

export = Effect;