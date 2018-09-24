import logger from './util/logger';
import * as cron from 'cron';
import * as fs from 'fs-extra';
import * as http from 'http';
import * as path from 'path';

import { IMAGE_FETCH_LOCATION } from './util/secrets';

export class Fetcher {
    private static instance: Fetcher;
    private cronJob: any;

    private constructor() {
        logger.debug('Fetcher.ctor');
        this.cronJob = new cron.CronJob('*/10 * * * * *', () => {
            this.fetchImage();
        }, undefined, true, 'Europe/Amsterdam');
    }

    fetchImage(): void {
        const latestFile = path.join(`${IMAGE_FETCH_LOCATION}`, 'latest.jpg');
        const file = fs.createWriteStream(latestFile);
        http.get('http://192.168.1.152:88/cgi-bin/CGIProxy.fcgi?cmd=snapPicture2&usr=admin&pwd=sevenum42', (res) => {
           res.pipe(file);
        }).on('error', (err) => {
            logger.error(`HTTP get error: ${err}`); return;
        });
        file.on('close', () => {
            const now = new Date().toISOString();
            const fn = path.join(`${IMAGE_FETCH_LOCATION}`, now.substr(0, 10), now.substr(0, 19));
            logger.debug(`fn = ${fn}`);
            fs.copy(latestFile, fn).catch(err => logger.error(err));
        });
    }

    static getInstance() {
        if (!Fetcher.instance) {
            Fetcher.instance = new Fetcher();
        }
    }
}