

import MessageDispatcher = require('../MessageDispatcher');

interface ClientAware {
    setMessageDispatcher(messageDispatcher:MessageDispatcher):void;
}

declare var ClientAware; //make IDE stop complaining

export = ClientAware;