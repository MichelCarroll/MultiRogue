

import Board = require('../Board');

interface BoardAware {
    setBoard(board:Board):void;
}

export = BoardAware;