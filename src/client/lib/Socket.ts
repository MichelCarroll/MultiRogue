


interface Socket {
    on(event: string, callback: (data: any) => void );
    emit(event: string, data: any);
    disconnect():void;
    io:any;
    connected:boolean;
    connect():void;
}

export default Socket;