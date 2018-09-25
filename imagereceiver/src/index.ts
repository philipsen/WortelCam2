
const server = require('./server');
const app = server.Server.bootstrap().app;

// import { Receiver } from './receiver';
import { Fetcher } from './fetcher';

// const receiver = Receiver.getInstance();

Fetcher.getInstance();