

import Level = require('../Level');

interface LevelAware {
    setLevel(level:Level):void;
}

export = LevelAware;