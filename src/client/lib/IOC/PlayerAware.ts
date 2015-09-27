

import GameObject = require('../../../common/GameObject');

interface PlayerAware {
    setPlayer(player:GameObject):void;
}

export = PlayerAware;