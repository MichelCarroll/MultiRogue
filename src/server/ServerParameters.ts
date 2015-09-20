

class ServerParameters {

    private port:number;
    private randomSeed:number;

    constructor(port:number, randomSeed:number) {
        this.port = port;
        this.randomSeed = randomSeed;
    }

    public getPort():number {
        return this.port;
    }

    public getRandomSeed():number {
        return this.randomSeed;
    }
}


export = ServerParameters;