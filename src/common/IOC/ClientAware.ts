

import MessageDispatcher  from '../MessageDispatcher';

interface ClientAware {
    setMessageDispatcher(messageDispatcher:MessageDispatcher):void;
}

export default ClientAware;