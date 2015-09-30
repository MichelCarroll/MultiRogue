
import UIAdapter = require('./UIAdapter');
import MessageClient = require('../../common/MessageClient');
import GameObject = require('../../common/GameObject');
import Level = require('./Level');
import DisplayAdapter = require('./DisplayAdapter');


class Context {
    public uiAdapter:UIAdapter;
    public messageClient:MessageClient;
    public player:GameObject;
    public level:Level;
    public displayAdapter:DisplayAdapter;
}

export = Context;