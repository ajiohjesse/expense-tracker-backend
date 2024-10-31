import { generateDatabaseId } from '@/lib/nanoid.js';
import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const userTable = sqliteTable(
    'users',
    {
        id: text().primaryKey().$defaultFn(generateDatabaseId),
        googleId: text(),
        email: text().unique().notNull(),
        fullName: text().notNull(),
        passwordHash: text(),
        isEmailVerified: integer({ mode: 'boolean' }).default(false),
        createdAt: text().default(sql`CURRENT_TIMESTAMP`)
    },
    (table) => ({
        emailIndex: index('email_index').on(table.email)
    })
);

export const inflowCategoryTable = sqliteTable('inflow_categories', {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: text()
        .notNull()
        .references(() => userTable.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    type: text().notNull(),
    createdAt: text().default(sql`CURRENT_TIMESTAMP`)
});

export const inflowTable = sqliteTable('inflows', {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: text()
        .notNull()
        .references(() => userTable.id, { onDelete: 'cascade' }),
    amount: integer().notNull(),
    categoryId: text()
        .notNull()
        .references(() => inflowCategoryTable.id, { onDelete: 'cascade' }),
    description: text(),
    createdAt: text().default(sql`CURRENT_TIMESTAMP`)
});

export const outflowCategoryTable = sqliteTable('outflow_categories', {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: text()
        .notNull()
        .references(() => userTable.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    type: text().notNull(),
    createdAt: text().default(sql`CURRENT_TIMESTAMP`)
});

export const outflowTable = sqliteTable('outflows', {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: text()
        .notNull()
        .references(() => userTable.id, { onDelete: 'cascade' }),
    amount: integer().notNull(),
    categoryId: text()
        .notNull()
        .references(() => inflowCategoryTable.id, { onDelete: 'cascade' }),
    description: text(),
    createdAt: text().default(sql`CURRENT_TIMESTAMP`)
});
