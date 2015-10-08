
import Command from '../../Command';
import MessageDispatcher from '../../MessageDispatcher';
import Message = require('../../Message');

import ClientAware from '../../IOC/ClientAware';
import IdleCommand = require('../Idle');
import Executor  from '../Executor';

class IdleExecutor implements Executor {

    private command:IdleCommand;

    constructor(command:IdleCommand) {
        this.command = command;
    }

    public execute() {
        //nothing
    }
}

export = IdleExecutor;