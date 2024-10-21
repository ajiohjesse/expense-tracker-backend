import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import { checksRoute } from './api/checks/checksRoute.js';
import { apiV1Route } from './api/v1/apiV1.js';
import { logger } from './helpers/logger.helpers.js';
import { APP_CONFIG } from './lib/app.config.js';
import { envConfig } from './lib/env.config.js';
import { errorHandler } from './middleware/error.middleware.js';
import { logHandler } from './middleware/logger.middleware.js';
import { notFoundHandler } from './middleware/notfound.middleware.js';

envConfig();
export const app = express();

logger.log('Initializing API...');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(logHandler);

app.use('/check', checksRoute);
app.use('/api/v1', apiV1Route);

app.use(notFoundHandler);
app.use(errorHandler);

export const server = app.listen(APP_CONFIG.port, () => {
    logger.log(`Server started on ${APP_CONFIG.hostname}:${APP_CONFIG.port}`);
});
