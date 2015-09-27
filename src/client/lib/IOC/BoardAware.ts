

import Board = require('../../../common/Board');

interface BoardAware {
    setBoard(board:Board):void;
}

export = BoardAware;