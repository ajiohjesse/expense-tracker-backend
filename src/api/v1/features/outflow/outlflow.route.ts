import { and, eq, ilike } from 'drizzle-orm';
import { Router } from 'express';
import {
    processRequest,
    processRequestParams,
    validateRequestBody,
    validateRequestQuery
} from 'zod-express-middleware';
import { db } from '../../../../db/index.js';
import { outflowTable } from '../../../../db/schema.js';
import { authorizeRequest } from '../../../../helpers/auth.helpers.js';
import {
    createErrorResponse,
    createSuccessResponse
} from '../../../../helpers/response.helpers.js';
import {
    OutflowBodySchema,
    OutflowParamsSchema,
    OutflowQuerySchema
} from './outflow.schema.js';

const router = Router();
export { router as outflowRoute };

router.get('/', validateRequestQuery(OutflowQuerySchema), async (req, res) => {
    const user = authorizeRequest(req.headers.authorization);
    const { categoryId, search, page = 1, limit = 20 } = req.query;

    const conditions = [eq(outflowTable.userId, user.userId)];

    if (categoryId) {
        conditions.push(eq(outflowTable.categoryId, categoryId));
    }

    if (search) {
        conditions.push(ilike(outflowTable.description, `%${search}%`));
    }

    const outflows = await db.query.outflowTable.findMany({
        where: () => and(...conditions),
        with: {
            category: true
        },
        limit,
        offset: (page - 1) * limit
    });

    const total = await db.$count(outflowTable, and(...conditions));

    const data = {
        outflows,
        total,
        page,
        limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1
    };

    return res.status(200).json(createSuccessResponse(data));
});

router.get(
    '/:outflowId',
    processRequestParams(OutflowParamsSchema),
    async (req, res) => {
        const user = authorizeRequest(req.headers.authorization);
        const { outflowId } = req.params;

        const outflow = await db.query.outflowTable.findFirst({
            where: and(
                eq(outflowTable.id, outflowId),
                eq(outflowTable.userId, user.userId)
            )
        });

        if (!outflow) {
            return res
                .status(404)
                .json(createErrorResponse('Outflow not found'));
        }

        return res.status(200).json(createSuccessResponse({ outflow }));
    }
);

router.post('/', validateRequestBody(OutflowBodySchema), async (req, res) => {
    const user = authorizeRequest(req.headers.authorization);
    const { amount, categoryId, description } = req.body;

    const [outflow] = await db
        .insert(outflowTable)
        .values({
            userId: user.userId,
            amount,
            categoryId,
            description
        })
        .returning();

    return res
        .status(201)
        .json(
            createSuccessResponse({ outflow }, 'Outflow created successfully')
        );
});

router.put(
    '/:outflowId',
    processRequest({
        body: OutflowBodySchema,
        params: OutflowParamsSchema
    }),
    async (req, res) => {
        const user = authorizeRequest(req.headers.authorization);
        const { amount, categoryId, description } = req.body;
        const { outflowId } = req.params;

        const [outflow] = await db
            .update(outflowTable)
            .set({
                amount,
                categoryId,
                description
            })
            .where(
                and(
                    eq(outflowTable.id, outflowId),
                    eq(outflowTable.userId, user.userId)
                )
            )
            .returning();

        return res
            .status(200)
            .json(
                createSuccessResponse(
                    { outflow },
                    'Outflow updated successfully'
                )
            );
    }
);

router.delete(
    '/:outflowId',
    processRequestParams(OutflowParamsSchema),
    async (req, res) => {
        const user = authorizeRequest(req.headers.authorization);
        const { outflowId } = req.params;

        const [outflow] = await db
            .delete(outflowTable)
            .where(
                and(
                    eq(outflowTable.id, outflowId),
                    eq(outflowTable.userId, user.userId)
                )
            )
            .returning();

        return res
            .status(200)
            .json(
                createSuccessResponse(
                    { outflow },
                    'Outflow deleted successfully'
                )
            );
    }
);
