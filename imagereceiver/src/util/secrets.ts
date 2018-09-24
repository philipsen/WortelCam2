import logger from './logger';
import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
    logger.debug('Using .env file to supply config environment variables');
    dotenv.config({ path: '.env' });
} else {
    logger.debug('Using .env.example file to supply config environment variables');
    dotenv.config({ path: '.env.example' });  // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const IMAGE_DROP_LOCATION = process.env['IMAGE_DROP_LOCATION'];
if (!IMAGE_DROP_LOCATION) {
    logger.error('No image drop location defined');
    process.exit(1);
}

export const IMAGE_FETCH_LOCATION = process.env['IMAGE_FETCH_LOCATION'];
if (!IMAGE_FETCH_LOCATION) {
    logger.error('No image FETCH location defined');
    process.exit(1);
}
