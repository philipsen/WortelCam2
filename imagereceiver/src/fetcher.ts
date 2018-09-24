import logger from './util/logger';
import * as cron from 'cron';
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';

import { IMAGE_FETCH_LOCATION } from './util/secrets';

export class Fetcher {
    private static instance: Fetcher;
    private cronJob: any;

    private constructor() {
        logger.debug('Fetcher.ctor');
        this.cronJob = new cron.CronJob('*/10 * * * * *', () => {
            logger.debug('job triggered');
            this.fetchImage();
        }, undefined, true, 'Europe/Amsterdam');
    }

    fetchImage(): void {
        const file = fs.createWriteStream(path.join(`${IMAGE_FETCH_LOCATION}`, 'latest.jpg'));
        http.get('http://192.168.1.152:88/cgi-bin/CGIProxy.fcgi?cmd=snapPicture2&usr=admin&pwd=sevenum42', (res) => {
           res.pipe(file);
        }).on('error', (err) => {
            logger.error(`HTTP get error: ${err}`);
        });
        file.on('close', () => {
            logger.debug('file closed');
        });
    }

    static getInstance() {
        if (!Fetcher.instance) {
            Fetcher.instance = new Fetcher();
        }
    }
}