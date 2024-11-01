import type { Config } from 'drizzle-kit';
import { envConfig } from './src/lib/env.config.js';

envConfig();

export default {
    schema: './build/src/db/schema.js',
    out: './src/db/migrations',
    dialect: 'turso',
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL || '',
        authToken: process.env.TURSO_AUTH_TOKEN || ''
    }
} satisfies Config;
