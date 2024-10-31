import { envConfig } from '@/lib/env.config.js';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';

envConfig();

const turso = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN
});

export const db = drizzle(turso, { schema, casing: 'snake_case' });
export { turso as dbConnection };
