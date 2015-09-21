

import UIAdapter = require('../UIAdapter');

interface UIAware {
    setUIAdapter(uiAdapter:UIAdapter):void;
}

export = UIAware;