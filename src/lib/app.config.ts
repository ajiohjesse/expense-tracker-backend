import { envConfig } from './env.config.js';

envConfig();

export const APP_CONFIG = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    hostname: process.env.HOSTNAME || 'localhost',
    env: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.TURSO_DATABASE_URL || '',
    authToken: process.env.TURSO_AUTH_TOKEN || '',
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
    cookieSecret: process.env.COOKIE_SECRET || '',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '30d',
    refreshCookieExpiry: 30 * 24 * 60 * 60 * 1000,
    refreshCookieName: '_refresh'
};
