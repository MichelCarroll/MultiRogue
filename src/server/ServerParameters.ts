

class ServerParameters {

    private port:number;

    constructor(port:number) {
        this.port = port;
    }

    public getPort():number {
        return this.port;
    }
}


export = ServerParameters;