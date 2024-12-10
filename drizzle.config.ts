import dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

const nodeEnv = process.env.NODE_ENV;

const dotenvPath =
    nodeEnv === 'test'
        ? '.env.test'
        : nodeEnv === 'staging'
          ? '.env.staging'
          : nodeEnv === 'production'
            ? '.env.production'
            : undefined;

dotenv.config({ path: dotenvPath });

export default {
    schema: './build/src/db/schema.js',
    out: './src/db/migrations',
    dialect: 'turso',
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL || '',
        authToken: process.env.TURSO_AUTH_TOKEN || ''
    }
} satisfies Config;
