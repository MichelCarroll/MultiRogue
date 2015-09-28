

import GameObjectLayer = require('../../../common/GameObjectLayer');

interface GameObjectLayerAware {
    setGameObjectLayer(board:GameObjectLayer):void;
}

export = GameObjectLayerAware;