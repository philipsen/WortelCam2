import logger from "./util/logger";

const server = require("./server");
const app = server.Server.bootstrap().app;

const io = require('socket.io')(server);

import { Receiver } from "./receiver";

const receiver = Receiver.getInstance();

//export default httpServer;
