import { verifyAccessToken } from '../lib/tokens.js';
import { PublicError } from './error.helpers.js';

export const authorizeRequest = (authorization?: string) => {
    const token = authorization?.split(' ')[1];

    if (!token) {
        throw new PublicError(401, 'Authentication is required');
    }

    const user = verifyAccessToken(token);

    if (!user) {
        throw new PublicError(401, 'Authentication failed');
    }

    return user;
};
