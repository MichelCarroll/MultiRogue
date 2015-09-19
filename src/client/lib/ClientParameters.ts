

class ClientParameters {

    private serverAddress:string;

    constructor(serverAddress:string) {
        this.serverAddress = serverAddress;
    }

    public getServerAddress():string {
        return this.serverAddress;
    }
}


export = ClientParameters;