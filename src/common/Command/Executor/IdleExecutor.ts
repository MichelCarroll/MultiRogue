
import Command = require('../../Command');
import MessageDispatcher = require('../../MessageDispatcher');
import Message = require('../../Message');

import ClientAware = require('../../IOC/ClientAware');
import IdleCommand = require('../Idle');
import Executor = require('../Executor');

class IdleExecutor implements Executor {

    private command:IdleCommand;

    constructor(command:IdleCommand) {
        this.command = command;
    }

    public execute() {

    }
}

export = IdleExecutor;