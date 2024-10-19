import logger from '@/lib/logger.js';
import type { Request, Response, NextFunction } from 'express';

export function logHandler(req: Request, res: Response, next: NextFunction) {
    logger.log(`Incoming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logger.log(`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
    });

    next();
}
