
import express from 'express';
import * as path from 'path';
import * as http from 'http';
// import * as serveStatic from 'serve-static';
const serveStatic = require('serve-static');


import socketIo from 'socket.io';

import { PictureSocket } from './picture/picture-socket';
import { FollowLatest } from './picture/follow-latest';
import logger from './util/logger';
import { IMAGE_FETCH_LOCATION } from './util/secrets';

export class Server {

    public app: express.Application;
    private server: any;
    private io: any;
    private port: any;
    private root: string = '/';

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        this.app = express();
        this.config();
        this.server = http.createServer(this.app);
        this.api();
        this.sockets();
        this.routes();
        this.listen();
    }

    public api() {
        const router = express.Router();
        router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.json({ announcement: 'Welcome to the api' });
            next();
        });

        // HouseApi.create(router);
        router.get('/images/latest.jpg', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            logger.debug('jpg');
            res.sendFile(path.join(`${IMAGE_FETCH_LOCATION}`, 'latest.jpg'));
        });
        router.get('/images/latest.jpeg', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            logger.debug('jpeg');
            res.sendFile(path.join(`${IMAGE_FETCH_LOCATION}`, 'latest.jpg'));
        });

        this.app.use('/api', router);

    }

    routes(): void {
        this.app.use(express.static(this.root));

        const router = express.Router();
        router.get('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const p = path.join(this.root, 'index.html');
            logger.debug(`p ${req.baseUrl} ${req.url} ${p}`);
             res.sendFile(p);
        });
        this.app.use('*', router);
        // serveStatic.serveStatic
        // this.app.use('/*', serveStatic(this.root));
    }

    public config() {
        this.port = 8080;
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });
        this.root = path.resolve(__dirname, '../../viewer-app/dist/viewer-app');
    }

    private sockets(): void {
        logger.debug('init sockets');
        this.io = socketIo(this.server);
        const latestSocket = new PictureSocket(this.io);
        const follower = FollowLatest.getInstance();
        follower.setSocket(latestSocket);
    }

    private listen(): void {
        this.server.listen(this.port);

        this.server.on('error', (error: any) => {
            logger.error(`Http Server Error: ${error}`);
        });

        this.server.on('listening', () => {
            logger.info(`Http Server listening on port ${this.port}`);
        });
    }
}