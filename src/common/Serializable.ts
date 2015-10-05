


interface Serializable {
    serialize():any;
    deserialize(data:any);
}

declare var Serializable; //make IDE stop complaining

export = Serializable;