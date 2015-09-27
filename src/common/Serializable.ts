/**
 * Created by michelcarroll on 15-03-29.
 */

interface Serializable {
    serialize():Object;
    deserialize(data:any);
}

export = Serializable;