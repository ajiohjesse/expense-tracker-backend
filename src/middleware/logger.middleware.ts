import type { Request, Response, NextFunction } from 'express';
import { logger } from '../helpers/logger.helpers';

export function logHandler(req: Request, res: Response, next: NextFunction) {
    const URL = req.originalUrl;
    logger.log(`Incoming - METHOD: [${req.method}] - URL: [${URL}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logger.log(`Result - METHOD: [${req.method}] - URL: [${URL}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
    });

    next();
}
