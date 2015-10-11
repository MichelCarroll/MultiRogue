
import GameObject = require('./GameObject');
import Notifier = require('./Notifier');
import Serializable from './Serializable';

interface Effect extends Serializable {

    setSource(source:GameObject);
    apply(target:GameObject);
    getObserverFeedbackMessage(target:GameObject):string;
    getSelfFeedbackMessage(target:GameObject):string;
    getTargetFeedbackMessage(target:GameObject):string;
    getFeedbackRadius():number;

}

export default Effect;