import logger from "./util/logger";

const serverclass = require("./server");
const debug = require("debug")("express:server");
const http = require("http");

const httpPort = "8080";
const app = serverclass.Server.bootstrap().app;
app.set("port", httpPort);
const server = http.createServer(app);

server.listen(httpPort);

server.on("error", onError);
server.on("listening", onListening);

function onError(error: any) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const port = server.port();
    const bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    console.log("listen..");
    const addr = server.address();
    const bind = typeof addr === "string"
        ? "pipe " + addr
        : "port " + addr.port;
    logger.debug("Listening on " + bind);
}

export default server;
