import type { ErrorRequestHandler } from 'express';
import { createErrorResponse } from '../helpers/response.helpers';
import { PublicError } from '../helpers/error.helpers';

export const errorHandler: ErrorRequestHandler = (error, _, response, __) => {
    if (error instanceof PublicError) {
        return response.status(error.statusCode).json(createErrorResponse(error.message, error.data));
    }

    let message = 'Internal server error';
    if (error instanceof Error) message = error.message;

    response.status(500).json(createErrorResponse('error', message));
};
