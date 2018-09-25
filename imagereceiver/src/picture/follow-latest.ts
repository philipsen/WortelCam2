
import { PictureSocket } from './picture-socket';
import logger from '../util/logger';


export class FollowLatest {
    private static instance: FollowLatest;

    private socket: any;
    private constructor() {
        this.socket = undefined;
    }

    notify(): void {
        if (this.socket) {
            this.socket.nsp.emit('update', new Date());
        } else {
            logger.warn('update without a socket');
        }
    }

    setSocket(socket: PictureSocket): void {
        this.socket = socket;
    }

    static getInstance(): FollowLatest {
        if (!FollowLatest.instance) {
            FollowLatest.instance = new FollowLatest();
        }
        return FollowLatest.instance;
    }
}
