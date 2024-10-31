import { PublicError } from '@/helpers/error.helpers.js';
import { createErrorResponse } from '@/helpers/response.helpers.js';
import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, _, response, __) => {
    if (error instanceof PublicError) {
        return response.status(error.statusCode).json(createErrorResponse(error.message, error.data));
    }

    let message = 'Internal server error';
    if (error instanceof Error) message = error.message;

    response.status(500).json(createErrorResponse(message));
};
