
const server = require('./server');
const app = server.Server.bootstrap().app;

import { Fetcher } from './fetcher';

Fetcher.getInstance();