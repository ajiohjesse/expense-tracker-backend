import { migrate } from 'drizzle-orm/libsql/migrator';
import { db, dbConnection } from './index.js';

(async () => {
    console.log('Starting migration...');
    await migrate(db, { migrationsFolder: './src/db/migrations' });

    dbConnection.close();
    console.log('Migration complete');
})();
