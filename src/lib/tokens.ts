import jwt from 'jsonwebtoken';
import { APP_CONFIG } from './app.config.js';

export interface AccessTokenPayload {
    userId: string;
    issuedVia: 'login' | 'refresh';
}

export interface RefreshTokenPayload {
    userId: string;
}

export const generateAccessToken = (payload: AccessTokenPayload) => {
    return jwt.sign(payload, APP_CONFIG.accessTokenSecret, {
        expiresIn: APP_CONFIG.accessTokenExpiry
    });
};

export const generateRefreshToken = (payload: RefreshTokenPayload) => {
    return jwt.sign(payload, APP_CONFIG.refreshTokenSecret, {
        expiresIn: APP_CONFIG.refreshTokenExpiry
    });
};

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(
            token,
            APP_CONFIG.accessTokenSecret
        ) as AccessTokenPayload;
    } catch (error) {
        return null;
    }
};

export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(
            token,
            APP_CONFIG.refreshTokenSecret
        ) as RefreshTokenPayload;
    } catch (error) {
        return null;
    }
};
