import { and, eq } from 'drizzle-orm';
import { Router } from 'express';
import { z } from 'zod';
import {
    processRequestParams,
    validateRequestBody
} from 'zod-express-middleware';
import { db } from '../../../../db/index.js';
import {
    inflowCategoryTable,
    outflowCategoryTable
} from '../../../../db/schema.js';
import { authorizeRequest } from '../../../../helpers/auth.helpers.js';
import { createSuccessResponse } from '../../../../helpers/response.helpers.js';

const router = Router();
export { router as categoryRoute };

router.get('/', async (req, res) => {
    const user = authorizeRequest(req.headers.authorization);

    const inflowCategoriespromise = db.query.inflowCategoryTable.findMany({
        where: (table, { eq }) => eq(table.userId, user.userId)
    });

    const outflowCategoriespromise = db.query.outflowCategoryTable.findMany({
        where: (table, { eq }) => eq(table.userId, user.userId)
    });

    const [inflowCategories, outflowCategories] = await Promise.all([
        inflowCategoriespromise,
        outflowCategoriespromise
    ]);

    return res
        .status(200)
        .json(createSuccessResponse({ inflowCategories, outflowCategories }));
});

router.post(
    '/inflow',
    validateRequestBody(z.object({ name: z.string() })),
    async (req, res) => {
        const user = authorizeRequest(req.headers.authorization);

        const { name } = req.body;

        const [inflowCategory] = await db
            .insert(inflowCategoryTable)
            .values({ userId: user.userId, name })
            .returning();

        return res
            .status(201)
            .json(
                createSuccessResponse(
                    { inflowCategory },
                    'Inflow category created successfully'
                )
            );
    }
);

router.post(
    '/outflow',
    validateRequestBody(z.object({ name: z.string() })),
    async (req, res) => {
        const user = authorizeRequest(req.headers.authorization);

        const { name } = req.body;

        const [outflowCategory] = await db
            .insert(outflowCategoryTable)
            .values({ userId: user.userId, name })
            .returning();

        return res
            .status(201)
            .json(
                createSuccessResponse(
                    { outflowCategory },
                    'Outflow category created successfully'
                )
            );
    }
);

router.delete(
    '/inflow/:inflowCategoryId',
    processRequestParams(z.object({ inflowCategoryId: z.coerce.number() })),
    async (req, res) => {
        const user = authorizeRequest(req.headers.authorization);
        const { inflowCategoryId } = req.params;

        const [inflowCategory] = await db
            .delete(inflowCategoryTable)
            .where(
                and(
                    eq(inflowCategoryTable.id, inflowCategoryId),
                    eq(inflowCategoryTable.userId, user.userId)
                )
            )
            .returning();

        return res
            .status(200)
            .json(
                createSuccessResponse(
                    { inflowCategory },
                    'Inflow category deleted successfully'
                )
            );
    }
);

router.delete(
    '/outflow/:outflowCategoryId',
    processRequestParams(z.object({ outflowCategoryId: z.coerce.number() })),
    async (req, res) => {
        const user = authorizeRequest(req.headers.authorization);
        const { outflowCategoryId } = req.params;

        const [outflowCategory] = await db
            .delete(outflowCategoryTable)
            .where(
                and(
                    eq(outflowCategoryTable.id, outflowCategoryId),
                    eq(outflowCategoryTable.userId, user.userId)
                )
            )
            .returning();

        return res
            .status(200)
            .json(
                createSuccessResponse(
                    { outflowCategory },
                    'Outflow category deleted successfully'
                )
            );
    }
);
