
const server = require('./server');
const app = server.Server.bootstrap().app;

import { Receiver } from './receiver';

const receiver = Receiver.getInstance();
