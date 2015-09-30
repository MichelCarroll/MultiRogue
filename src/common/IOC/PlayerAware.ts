

import GameObject = require('../GameObject');

interface PlayerAware {
    setPlayer(player:GameObject):void;
}

export = PlayerAware;