
///<reference path='../../definitions/dynamicClassLoader.d.ts' />

import Referenceable from './Referenceable';
import Repository = require('./Repository');

class Referencer {

    private repository;

    constructor(repository:Repository) {
        this.repository = repository;
    }

    public reference(object:Referenceable):number {
        return object.getId();
    }

    public dereference(reference:number):Referenceable {
        return this.repository.get(reference);
    }
}

export = Referencer;