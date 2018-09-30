import { Observable } from 'rxjs';
import * as io from 'socket.io-client';


export class SocketService {

    private name: string;
    // private host: string = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
    private host: string = window.location.protocol + '//' + window.location.hostname + ':' + '8080';
    socket: io.SocketIOClient.Socket;

    constructor() {
        console.log(`SocketService.ctor host:${this.host}`);
    }

    // Get items observable
    get(name: string): Observable<any> {
        console.log('SocketService::get ' + name);
        this.name = name;
        const socketUrl = '/' + this.name;
        console.log('url = ' + socketUrl);
        this.socket = io.connect(socketUrl);
        // this.socket.on('connect', () => this.connect());
        this.socket.on('disconnect', () => this.disconnect());
        this.socket.on('error', (error: string) => {
            console.log(`ERROR: "${error}" (${socketUrl})`);
        });

        // Return observable which follows "create" and "remove" signals from socket stream
        return Observable.create((observer: any) => {
            this.socket.on('create', (item: any) => observer.next({ action: 'create', item: item }));
            this.socket.on('remove', (item: any) => observer.next({ action: 'remove', item: item }));
            this.socket.on('update', (item: any) => observer.next({ action: 'update', item: item }));
            return () => this.socket.close();
        });
    }

    // Create signal
    create(name: string) {
        this.socket.emit('create', name);
    }

    // Remove signal
    remove(name: string) {
        this.socket.emit('remove', name);
    }

    // Handle connection opening
    private connect() {
        console.log(`Connected to "${this.name}"`);

        // Request initial list when connected
        this.socket.emit('list');
    }

    // Handle connection closing
    private disconnect() {
        console.log(`Disconnected from "${this.name}"`);
    }
}
