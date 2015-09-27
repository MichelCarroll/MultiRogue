
///<reference path='../../definitions/dynamicClassLoader.d.ts' />

import Serializable = require('./Serializable');

var DynamicClassLoader:any;

class Serializer {

    static serialize(object:Serializable):any {
        return {
            'className': (<any>object).constructor.name,
            'properties': object.serialize()
        };
    }

    static deserialize(data:any):Serializable {
        if(!DynamicClassLoader) {
            DynamicClassLoader = require('./DynamicClassLoader'); //to avoid circular dependencies
        }
        var object:Serializable = DynamicClassLoader(data.className);
        if(!object) {
            throw new Error('Cannot instanciate the class '+data.className);
        }
        object.deserialize(data.properties);
        return object;
    }
}

export = Serializer;