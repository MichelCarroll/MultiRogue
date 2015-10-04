/**
 * Created by michelcarroll on 15-04-03.
 */

import Command = require('../../common/Command');

import Context = require('./Context');

class Commander {

    private context:Context;

    constructor(context:Context) {
        this.context = context;
    }

    private inject(command:any)
    {
        if(command.setGameObjectLayer) {
            command.setGameObjectLayer(this.context.getLevel().getGameObjectLayer());
        }
        if(command.setPlayer) {
            command.setPlayer(this.context.getPlayer());
        }
        if(command.setMessageClient) {
            command.setMessageClient(this.context.getMessageClient());
        }
    }

    private getRemainingTurns() {
        return this.context.getPlayer().getPlayableComponent().getRemainingTurns();
    }

    public executeCommand(command:Command)
    {
        if(command.hasOwnProperty('setPlayer')) {
            this.context.getUIAdapter().logOnUI("You need to be connected to do this!");
            return;
        }

        this.inject(command);

        if(command.getTurnsRequired() > 0) {
            if(!this.getRemainingTurns()) {
                this.context.getUIAdapter().logOnUI("It's not your turn!");
                return;
            }
            else if(this.getRemainingTurns() - command.getTurnsRequired() < 0) {
                this.context.getUIAdapter().logOnUI("You don't have enough turns to do this!");
                return;
            }
        }

        if(!command.canExecute()) {
            this.context.getUIAdapter().logOnUI("You can't do that!");
            return;
        }

        var feedbackMessage = command.getFeedbackMessage(); //race condition
        command.dispatch(this.context.getMessageClient());

        if(feedbackMessage.length > 0) {
            this.context.getUIAdapter().logOnUI(feedbackMessage);
        }

        if(command.getTurnsRequired() > 0) {
            if (this.getRemainingTurns() <= 0) {
                this.context.getUIAdapter().logOnUI("Your turn is over.");
            }
        }
    }
}

export = Commander;