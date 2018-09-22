
import express from 'express';
//  import * as morgan from "morgan";
// import * as path from "path";
// import errorHandler = require("errorhandler");
// import mongoose = require("mongoose");
// import * as cors from "cors";
// import dotenv from "dotenv";
// import { HouseApi } from "./api/house";
// import { runInNewContext } from "vm";

// import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

import * as http from 'http';
import socketIo from 'socket.io';
import { PictureSocket } from './picture/picture-socket';
import { FollowLatest } from './picture/follow-latest';
import logger from './util/logger';

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

        // Configure sockets
        private sockets(): void {
            // Get socket.io handle
            this.io = socketIo(this.server);
            // let roomSocket = new RoomSocket(this.io);
            const latestSocket = new PictureSocket(this.io);
            const follower = new FollowLatest(latestSocket);
        }

        // Start HTTP server listening
        private listen(): void {
            // listen on provided ports
            this.server.listen(this.port);

            // add error handler
            this.server.on('error', (error: any) => {
                logger.error(error);
            });

            // start listening on port
            this.server.on('listening', () => {
                // console.log('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', this.port, this.port);
            });
        }
}