import logger from "./util/logger";

const server = require("./server");
//const debug = require("debug")("express:server");
//const http = require("http");
//const httpPort = "8080";
const app = server.Server.bootstrap().app;
//app.set("port", httpPort);

//const httpServer = http.createServer(app);
//httpServer.listen(httpPort);
//httpServer.on("error", onError);
//httpServer.on("listening", onListening);

const io = require('socket.io')(server);

io.on('connection', (socket: any) => {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', (data: any) => {
        console.log(data);
    });
});

// function onError(error: any) {
    
//     if (error.syscall !== "listen") {
//         throw error;
//     }

//     const port = httpServer.port();
//     const bind = typeof port === "string"
//         ? "Pipe " + port
//         : "Port " + port;

//     // handle specific listen errors with friendly messages
//     switch (error.code) {
//         case "EACCES":
//             console.error(bind + " requires elevated privileges");
//             process.exit(1);
//             break;
//         case "EADDRINUSE":
//             console.error(bind + " is already in use");
//             process.exit(1);
//             break;
//         default:
//             throw error;
//     }
// }

// function onListening() {
//     console.log("listen..");
//     const addr = httpServer.address();
//     const bind = typeof addr === "string"
//         ? "pipe " + addr
//         : "port " + addr.port;
//     logger.debug("Listening on " + bind);
// }

//const receiver = require("./receiver");
import { Receiver } from "./receiver";

const receiver = Receiver.getInstance();

//export default httpServer;
