


interface Socket {
    on(event: string, callback: (data: any) => void );
    emit(event: string, data: any);
    disconnect():void;
}

declare var Socket; //make IDE stop complaining

export = Socket;