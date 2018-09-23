
import * as fs from 'fs';
import * as path from 'path';

import { PictureSocket } from './picture-socket';
import logger from '../util/logger';
import { IMAGE_DROP_LOCATION } from '../util/secrets';


export class FollowLatest {
    constructor(socket: PictureSocket) {
        socket = socket;
        this.init(socket);
    }

    private init(socket: PictureSocket): void {
        const latestimage = path.join(`${IMAGE_DROP_LOCATION}`, 'latest.jpeg');
        logger.debug(`FollowLatest init tracker: ${latestimage}`);
        const realFile = latestimage;
        // fs.readlink(latestimage, (err, realFile) => {
        //     if (err) {
        //         logger.error(err);
        //         return;
        //     }
             // tslint:disable-next-line:prefer-template
             logger.debug('FollowLatest real file to watch = ' + realFile);
             fs.watchFile(realFile, function (curr, prev) {
                 // tslint:disable-next-line:prefer-template
                 logger.debug('FollowLatest pic changed ' + curr.ctime);
                socket.nsp.emit('update', curr.ctime);
            });
        // });
    }
}
