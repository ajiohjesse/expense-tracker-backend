import { envConfig } from './env.config.js';

envConfig();

export const APP_CONFIG = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    hostname: process.env.HOSTNAME || 'localhost',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

    databaseUrl: process.env.TURSO_DATABASE_URL || '',
    authToken: process.env.TURSO_AUTH_TOKEN || '',

    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    googleRedirectUrl: process.env.CLIENT_URL + '/auth/google/callback',

    googleStateCookieName: 'google-state',
    googleCodeVerifierCookieName: 'google-code-verifier',
    googleAuthCookieMaxAge: 10 * 60 * 1000,

    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
    cookieSecret: process.env.COOKIE_SECRET || '',
    passwordResetSecret: process.env.PASSWORD_RESET_SECRET || '',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: '30d',
    refreshCookieExpiry: 30 * 24 * 60 * 60 * 1000,
    refreshCookieName: '_refresh',
    passwordResetTokenExpiry: '30m'
};
