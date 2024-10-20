export class PublicError extends Error {
    statusCode: number;
    data: unknown;

    constructor(statusCode: number, message: string, data: unknown = null) {
        super(message);
        this.name = 'PublicError';
        this.statusCode = statusCode;
        this.data = data;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const createError = (statusCode: number, message: string, data: unknown = null) => {
    return new PublicError(statusCode, message, data);
};
