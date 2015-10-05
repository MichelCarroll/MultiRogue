

interface ServerParameters {
    port?:number;
    numberFollowBots?:boolean;
    randomSeed:number;
}

declare var ServerParameters; //make IDE stop complaining

export = ServerParameters;