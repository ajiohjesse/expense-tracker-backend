import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { generateDatabaseId } from '../lib/nanoid.js';

export const userTable = sqliteTable(
    'users',
    {
        id: text().primaryKey().$defaultFn(generateDatabaseId),
        googleId: text('google_id'),
        email: text().unique().notNull(),
        fullName: text('full_name').notNull(),
        passwordHash: text('password_hash'),
        isEmailVerified: integer('is_email_verified', { mode: 'boolean' }).default(false),
        createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
    },
    (table) => ({
        emailIndex: index('email_index').on(table.email)
    })
);

export const inflowCategoryTable = sqliteTable('inflow_categories', {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: text('user_id')
        .notNull()
        .references(() => userTable.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    type: text().notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

export const inflowTable = sqliteTable('inflows', {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: text('user_id')
        .notNull()
        .references(() => userTable.id, { onDelete: 'cascade' }),
    amount: integer().notNull(),
    categoryId: text('category_id')
        .notNull()
        .references(() => inflowCategoryTable.id, { onDelete: 'cascade' }),
    description: text(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

export const outflowCategoryTable = sqliteTable('outflow_categories', {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: text('user_id')
        .notNull()
        .references(() => userTable.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    type: text().notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

export const outflowTable = sqliteTable('outflows', {
    id: integer().primaryKey({ autoIncrement: true }),
    userId: text('user_id')
        .notNull()
        .references(() => userTable.id, { onDelete: 'cascade' }),
    amount: integer().notNull(),
    categoryId: text('category_id')
        .notNull()
        .references(() => inflowCategoryTable.id, { onDelete: 'cascade' }),
    description: text(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});
