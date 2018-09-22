
import express from "express";
//  import * as morgan from "morgan";
// import * as path from "path";
// import errorHandler = require("errorhandler");
// import mongoose = require("mongoose");
// import * as cors from "cors";
// import dotenv from "dotenv";
// import { HouseApi } from "./api/house";
// import { runInNewContext } from "vm";

// import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

export class Server {

    public app: express.Application;

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        this.app = express();
        this.config();
        this.api();
    }

    public api() {
        console.log("init api");
        const router = express.Router();
        router.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.json({ announcement: "Welcome to the api" });
            next();
        });

        // HouseApi.create(router);

        this.app.use("/api", router);

    }

    public config() {
        // dotenv.config({ path: ".env.example" });
        // const mongoUrl = MONGODB_URI;
        // mongoose.connect(mongoUrl);
        // mongoose.connection.on("error", error => {
        //     console.error(error);
        // });

        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });

        // this.app.use(errorHandler());

    }
}