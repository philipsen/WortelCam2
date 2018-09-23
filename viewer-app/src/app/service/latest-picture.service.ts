import { SocketService } from './socket.service';
import { ISocketItem } from '../models/i-socket-item';
import { ReplaySubject } from 'rxjs';

export class LatestPictureService {
    latestTimestamp: ReplaySubject<any> = new ReplaySubject(1);
    // // messages: ReplaySubject<any> = new ReplaySubject(1);
    // // private list: List<any> = List();
    private socketService: SocketService;

    constructor() {
        console.log('LatestPictureService ctor');

        this.socketService = new SocketService();
        this.socketService
             .get('latest')
             .subscribe(
                 (socketItem: ISocketItem) => {
                     console.log('got latest ' + socketItem.action + ' ' + socketItem.item);
                    const timestamp: string = socketItem.item;
                    this.latestTimestamp.next(timestamp);
                    // this.latestTimestamp = socketItem.item;
                    // let message: IMessage = socketItem.item;
                    // this.list = this.list.push(message);
                    // this.messages.next(this.list);
                },
                error => console.log(error)
            );
    }
}

