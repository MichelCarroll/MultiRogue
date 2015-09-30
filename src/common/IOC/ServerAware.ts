

import MessageClient = require('../MessageClient');

interface ServerAware {
    setMessageClient(messageClient:MessageClient):void;
}

export = ServerAware;