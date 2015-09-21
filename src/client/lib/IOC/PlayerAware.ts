

import Player = require('../Player');

interface PlayerAware {
    setPlayer(player:Player):void;
}

export = PlayerAware;