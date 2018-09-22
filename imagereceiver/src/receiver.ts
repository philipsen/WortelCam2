import { IMAGE_DROP_LOCATION } from './util/secrets';

import logger from './util/logger';
import * as fs from 'fs';
import * as path from 'path';

logger.info('load recevier');

export class Receiver {
    private static instance: Receiver;

    private constructor() {
        logger.debug(`Receiver.ctor loc = ${IMAGE_DROP_LOCATION}`);
        // this.watcher = new FSWatcher();
        const latestimage = path.join(`${IMAGE_DROP_LOCATION}`, 'latest.jpeg');
        const imageLocation = path.normalize(`${IMAGE_DROP_LOCATION}`);
        logger.debug(`path = ${imageLocation}`);
        fs.watch(imageLocation, { encoding: 'buffer' }, (eventType, filename) => {
            logger.debug(`change detected type=${eventType}, fn=${filename}`);
            const imagePath = path.join(imageLocation, filename.toString());
            if (eventType === 'rename' && filename.toString() !== 'latest.jpeg') {
                fs.stat(imagePath, (err, stat) => {
                    if (err) {
                        logger.debug('file not found');
                        return;
                    }
                    logger.debug(`stat file= ${stat} ${stat.size}`);
                    fs.stat(latestimage, (err, stats) => {
                        logger.debug(`image stat err=${err}, stat = ${stats}`);
                        if (stat) {
                            // logger.debug('unline latest');
                            fs.unlink(latestimage, (err) => {
                                if (err) {
                                    logger.error('removing symlink failed');
                                }
                            });
                        }
                        logger.info(`new image ${filename}`);
                        fs.symlink(`${filename}`, latestimage, (err) => {
                            if (err) logger.error('symlink creation failed');
                            // logger.info(`symlink message: ${err}`);
                        });
                    });
                });
            }
        });
    }
    static getInstance() {
        if (!Receiver.instance) {
            Receiver.instance = new Receiver();
        }
    }
}
