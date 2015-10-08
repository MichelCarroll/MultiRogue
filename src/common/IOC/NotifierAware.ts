

import Notifier = require('../Notifier');

interface NotifierAware {
    setNotifier(notifier:Notifier):void;
}

export default NotifierAware;