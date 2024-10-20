import express, { type Response } from 'express';
import http from 'http';
import { logHandler } from './middleware/logger.middleware.js';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import { apiV1Route } from '@/api/v1/apiV1.js';
import '@/lib/env.config';
import { createErrorResponse, createSuccessResponse } from './helpers/response.helpers.js';
import { errorHandler } from './middleware/error.middleware.js';
import { APP_CONFIG } from './lib/app.config.js';
import { logger } from './helpers/logger.helpers.js';

const app = express();
let httpServer: ReturnType<typeof http.createServer>;

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

    app.get('/check/env', (req, res) => {
        logger.info(req.headers.cookie);

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
    app.use(errorHandler);

    httpServer = http.createServer(app);
    httpServer.listen(APP_CONFIG.port, () => {
        logger.log(`Server started on ${APP_CONFIG.hostname}:${APP_CONFIG.port}`);
    });
};

export const shutdownServer = (callback: any) => {
    httpServer && httpServer.close(callback);
};

// start server
Main();
