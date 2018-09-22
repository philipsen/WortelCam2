import logger from '../util/logger';

export class PictureSocket {
    nsp: any;
    // name: string;
    // data: any;
    socket: any;

    constructor(private io: any) {
        // console.log('PictureSocket ctor');
        this.nsp = this.io.of('/latest');
        this.nsp.on('connection', (socket: any) => {
            // console.log('Client connected ' + socket.id + ' ' + socket.client.request.headers['user-agent']);
            // console.log("data = " + JSON.stringify(socket.client.request.headers));
            this.socket = socket;
            // tslint:disable-next-line:prefer-template
            this.socket.on('disconnect', () => logger.error('disconnected ' + this.socket.id));
        });
    }
}