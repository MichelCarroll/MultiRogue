

import GameObject = require('../GameObject');

interface PlayerAware {
    setPlayer(player:GameObject):void;
}

declare var PlayerAware; //make IDE stop complaining

export = PlayerAware;