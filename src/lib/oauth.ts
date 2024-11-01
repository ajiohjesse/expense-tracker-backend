import { Google } from 'arctic';
import { APP_CONFIG } from './app.config.js';

export const googleOauthClient = new Google(
    APP_CONFIG.googleClientId,
    APP_CONFIG.googleClientSecret,
    APP_CONFIG.googleRedirectUrl
);
