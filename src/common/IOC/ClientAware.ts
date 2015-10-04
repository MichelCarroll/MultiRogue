

import MessageDispatcher = require('../MessageDispatcher');

interface ClientAware {
    setMessageDispatcher(messageDispatcher:MessageDispatcher):void;
}

export = ClientAware;