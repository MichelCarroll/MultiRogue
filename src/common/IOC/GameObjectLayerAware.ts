

import GameObjectLayer = require('../GameObjectLayer');

interface GameObjectLayerAware {
    setGameObjectLayer(board:GameObjectLayer):void;
}

export default GameObjectLayerAware;