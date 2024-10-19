export default class PublicError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.name = 'PublicError';
        this.statusCode = statusCode;
    }
}
