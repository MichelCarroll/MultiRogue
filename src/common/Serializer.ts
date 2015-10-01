
///<reference path='../../definitions/dynamicClassLoader.d.ts' />

import Serializable = require('./Serializable');

var DynamicClassLoader:any;

class Serializer {

    static serialize(object:Serializable):any {
        return {
            '__className': (<any>object).constructor.name,
            '__properties': object.serialize()
        };
    }

    static deserialize(data:any):Serializable {
        if(!DynamicClassLoader) {
            DynamicClassLoader = require('./DynamicClassLoader'); //to avoid circular dependencies
        }
        var object:Serializable = DynamicClassLoader(data.__className);
        if(!object) {
            throw new Error('Cannot instanciate the class '+data.__className);
        }
        object.deserialize(data.__properties);
        return object;
    }
}

export = Serializer;