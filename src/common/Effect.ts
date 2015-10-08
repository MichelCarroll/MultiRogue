
import GameObject = require('./GameObject');
import Serializable from './Serializable';

interface Effect extends Serializable {

    apply(target:GameObject);
    getFeedbackMessage(target:GameObject):string;

}

export default Effect;