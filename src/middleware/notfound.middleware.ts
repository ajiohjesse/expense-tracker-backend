import type { RequestHandler } from 'express';
import { createErrorResponse } from '../helpers/response.helpers.js';

export const notFoundHandler: RequestHandler = (_, res) => {
    return res.status(404).json(createErrorResponse('Resource Not found'));
};
