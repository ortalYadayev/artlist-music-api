import * as dotenv from 'dotenv';
import express from 'express'
import bodyParser from 'body-parser';
import cors from 'cors';
import path from "path";

import musicRouter from "./contorollers/music";

const createExpressInstance = () => {
    dotenv.config({ path: path.resolve(__dirname, '../.env') });

    const app = express()

    app.use(cors())

    app.use(bodyParser.json())

    app.use((_, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "*");
        res.setHeader("Access-Control-Allow-Headers", "*");
        next();
    });

    // Routes
    app.get("/", (request, response) => {
        response.send("Application is up and running");
    });

    app.use(musicRouter);

    return app
}

export default createExpressInstance