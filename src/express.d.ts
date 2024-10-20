import { Request } from 'express';

// Extend the Express Request interface globally
declare global {
    namespace Express {
        interface Request {
            locals: {
                user?: {
                    id: string;
                };
            };
        }
    }
}
