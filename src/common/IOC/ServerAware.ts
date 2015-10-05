

import MessageClient = require('../MessageClient');

interface ServerAware {
    setMessageClient(messageClient:MessageClient):void;
}

declare var ServerAware; //make IDE stop complaining

export = ServerAware;