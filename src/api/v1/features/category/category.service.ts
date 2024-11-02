import { db } from '../../../../db/index.js';
import {
    inflowCategoryTable,
    outflowCategoryTable
} from '../../../../db/schema.js';
import { DEFAULT_CATEGORIES } from './category.constants.js';

export const createDefaultCategories = async (userId: string) => {
    await db.transaction(async (trx) => {
        await trx.insert(inflowCategoryTable).values(
            DEFAULT_CATEGORIES.inflow.map((name) => ({
                userId,
                name
            }))
        );
        await trx.insert(outflowCategoryTable).values(
            DEFAULT_CATEGORIES.outflow.map((name) => ({
                userId,
                name
            }))
        );
    });
};
