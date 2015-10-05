

import GameObjectLayer = require('../GameObjectLayer');

interface GameObjectLayerAware {
    setGameObjectLayer(board:GameObjectLayer):void;
}

declare var GameObjectLayerAware; //make IDE stop complaining

export = GameObjectLayerAware;