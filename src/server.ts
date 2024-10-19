import express, { type NextFunction, type Response, type Request } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import logger from './lib/logger.js';
import { logHandler } from './middleware/logger.middleware.js';
import cors from 'cors';
import helmet from 'helmet';
import { createErrorResponse, createSuccessResponse } from './lib/helpers.js';
import PublicError from './lib/error.js';
import 'express-async-errors';
import { apiV1Route } from './api/v1/apiV1.js';

const nodeEnv = process.env.NODE_ENV;
const dotenvPath = nodeEnv === 'test' ? '.env.test' : nodeEnv === 'staging' ? '.env.staging' : '.env.local';
dotenv.config({ path: dotenvPath });

const PORT = process.env.PORT || 8080;
const HOSTNAME = process.env.HOSTNAME || 'localhost';

const app = express();
export let httpServer: ReturnType<typeof http.createServer>;

export const Main = () => {
    logger.log('Initializing API...');

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(helmet());
    app.use(cors());
    app.use(logHandler);

    app.get('/check/health', (_, res) => {
        return res.status(200).json(createSuccessResponse('Server is running'));
    });

    app.get('/check/env', (_, res) => {
        logger.info(process.env.NODE_ENV);

        return res.status(200).json(
            createSuccessResponse({
                environment: process.env.NODE_ENV || null
            })
        );
    });

    //API V1
    app.use('/api/v1', apiV1Route);

    //Not found routes
    app.use((_, res: Response) => {
        return res.status(404).json(createErrorResponse('Resource Not found'));
    });

    //Error handling
    app.use((error: Error, _: Request, res: Response, __: NextFunction) => {
        logger.error(error);
        if (error instanceof PublicError) {
            return res.status(error.statusCode).json(createErrorResponse(error.message));
        }

        return res.status(500).json(createErrorResponse('Internal server error'));
    });

    httpServer = http.createServer(app);
    httpServer.listen(PORT, () => {
        logger.log(`Server started on ${HOSTNAME}:${PORT}`);
    });
};

export const shutdown = (callback: any) => {
    httpServer && httpServer.close(callback);
};

Main();
