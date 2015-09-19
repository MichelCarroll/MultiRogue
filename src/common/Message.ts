

class Message {

    private name:string;
    private data:any;

    constructor(name, data) {
        this.name = name;
        this.data = data;
    }

    public getName():string {
        return this.name;
    }

    public getData():any {
        return this.data;
    }

}

export = Message;