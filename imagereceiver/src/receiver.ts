import { IMAGE_DROP_LOCATION } from './util/secrets';

import logger from './util/logger';
import * as fs from 'fs';
import * as path from 'path';
import semaphore from 'semaphore';

logger.info('load recevier');


export class Receiver {
    [x: string]: any;
    private static instance: Receiver;
    private sem: any;

    private constructor() {
        logger.debug(`Receiver.ctor loc = ${IMAGE_DROP_LOCATION}`);

        this.sem = require('semaphore')(1);
        // this.watcher = new FSWatcher();
        const latestimage = path.join(`${IMAGE_DROP_LOCATION}`, 'latest.jpeg');
        const imageLocation = path.normalize(`${IMAGE_DROP_LOCATION}`);
        logger.debug(`path = ${imageLocation}`);
        let previousFilename = '';
        fs.watch(imageLocation, { encoding: 'buffer' }, (eventType, filename) => {
            if (eventType === 'change' || filename.toString() == 'latest.jpeg') return;
            // logger.debug(`change detected type=${eventType}, fn=${filename} sem=${this.sem.available()}`);
            this.sem.take(() => {
                // logger.debug('got sem');
                if (filename.toLocaleString() == previousFilename) {
                    // logger.debug('dup detected');
                    this.sem.leave();
                    return;
                } else {
                    previousFilename = filename.toString();
                }
                const mat = filename.toString().match('.*\.jpg$');
                if (mat == undefined) {
                    this.sem.leave();
                    return;
                }
                const imagePath = path.join(imageLocation, filename.toString());
                if (filename.toString() !== 'latest.jpeg') {
                    fs.stat(imagePath, (err, stat) => {
                        if (err) {
                            logger.debug('file not found');
                            this.sem.leave();
                            return;
                        }

                        // logger.debug(`stat file= ${stat} ${stat.size}`);
                        fs.stat(latestimage, (err, stats) => {
                            // logger.debug(`image stat err=${err}, stat = ${stats}`);
                            if (stat) {
                                fs.unlink(latestimage, (err) => {
                                    if (err) {
                                        logger.error('removing symlink failed');
                                        // this.sem.leave();
                                        return;
                                    }
                                });
                            }
                            logger.info(`new image ${filename}`);
                            fs.symlink(`${filename}`, latestimage, (err) => {
                                if (err) logger.error('symlink creation failed');
                            });
                        });
                        this.sem.leave(); return;
                    });
                }
                // this.sem.leave();
            });
        });
    }
    static getInstance() {
        if (!Receiver.instance) {
            Receiver.instance = new Receiver();
        }
    }
}
