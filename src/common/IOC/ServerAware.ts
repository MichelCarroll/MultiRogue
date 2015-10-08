

import MessageClient from '../MessageClient';

interface ServerAware {
    setMessageClient(messageClient:MessageClient):void;
}

export default ServerAware;