
import express from 'express';
import * as path from 'path';
import * as http from 'http';
import socketIo from 'socket.io';

import { PictureSocket } from './picture/picture-socket';
import { FollowLatest } from './picture/follow-latest';
import logger from './util/logger';
import { IMAGE_DROP_LOCATION } from './util/secrets';

export class Server {

    public app: express.Application;
    private server: any;
    private io: any;
    private port: any;

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        this.app = express();
        this.config();
        this.server = http.createServer(this.app);
        this.api();
        this.sockets();
        this.listen();
    }

    public api() {
        const router = express.Router();
        router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.json({ announcement: 'Welcome to the api' });
            next();
        });

        // HouseApi.create(router);
        router.get('/images/latest.jpeg', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.sendFile(path.join(`${IMAGE_DROP_LOCATION}`, 'latest.jpeg'));
        });

        this.app.use('/api', router);

    }

    public config() {
        this.port = 8080;
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });

        // this.app.use(errorHandler());

    }
        private sockets(): void {
            logger.debug('init sockets');
            this.io = socketIo(this.server);
            const latestSocket = new PictureSocket(this.io);
            const follower = new FollowLatest(latestSocket);
        }

        // Start HTTP server listening
        private listen(): void {
            this.server.listen(this.port);

            // add error handler
            this.server.on('error', (error: any) => {
                logger.error(`Http Server Error: ${error}`);
            });

            // start listening on port
            this.server.on('listening', () => {
                logger.info(`Http Server listening on port ${this.port}`);
            });
        }
}