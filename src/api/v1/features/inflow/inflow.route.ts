import { and, eq, ilike } from 'drizzle-orm';
import { Router } from 'express';
import {
    processRequest,
    processRequestParams,
    validateRequestBody,
    validateRequestQuery
} from 'zod-express-middleware';
import { db } from '../../../../db/index.js';
import { inflowTable } from '../../../../db/schema.js';
import { authorizeRequest } from '../../../../helpers/auth.helpers.js';
import {
    createErrorResponse,
    createSuccessResponse
} from '../../../../helpers/response.helpers.js';
import {
    InflowBodySchema,
    InflowParamsSchema,
    InflowQuerySchema
} from './inflow.schema.js';

const router = Router();
export { router as inflowRoute };

router.get('/', validateRequestQuery(InflowQuerySchema), async (req, res) => {
    const user = authorizeRequest(req.headers.authorization);
    const { categoryId, search, page = 1, limit = 20 } = req.query;

    const conditions = [eq(inflowTable.userId, user.userId)];

    if (categoryId) {
        conditions.push(eq(inflowTable.categoryId, categoryId));
    }

    if (search) {
        conditions.push(ilike(inflowTable.description, `%${search}%`));
    }

    const inflows = await db.query.inflowTable.findMany({
        where: () => and(...conditions),
        with: {
            category: true
        },
        limit,
        offset: (page - 1) * limit
    });

    const total = await db.$count(inflowTable, and(...conditions));

    const data = {
        inflows,
        total,
        page,
        limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1
    };

    return res.status(200).json(createSuccessResponse(data));
});

router.get(
    '/:inflowId',
    processRequestParams(InflowParamsSchema),
    async (req, res) => {
        const user = authorizeRequest(req.headers.authorization);
        const { inflowId } = req.params;

        const inflow = await db.query.inflowTable.findFirst({
            where: and(
                eq(inflowTable.id, inflowId),
                eq(inflowTable.userId, user.userId)
            )
        });

        if (!inflow) {
            return res
                .status(404)
                .json(createErrorResponse('Inflow not found'));
        }

        return res.status(200).json(createSuccessResponse({ inflow }));
    }
);

router.post('/', validateRequestBody(InflowBodySchema), async (req, res) => {
    const user = authorizeRequest(req.headers.authorization);
    const { amount, categoryId, description } = req.body;

    const [inflow] = await db
        .insert(inflowTable)
        .values({
            userId: user.userId,
            amount,
            categoryId,
            description
        })
        .returning();

    return res
        .status(201)
        .json(createSuccessResponse({ inflow }, 'Inflow created successfully'));
});

router.put(
    '/:inflowId',
    processRequest({
        body: InflowBodySchema,
        params: InflowParamsSchema
    }),
    async (req, res) => {
        const user = authorizeRequest(req.headers.authorization);
        const { amount, categoryId, description } = req.body;
        const { inflowId } = req.params;

        const [inflow] = await db
            .update(inflowTable)
            .set({
                amount,
                categoryId,
                description
            })
            .where(
                and(
                    eq(inflowTable.id, inflowId),
                    eq(inflowTable.userId, user.userId)
                )
            )
            .returning();

        return res
            .status(200)
            .json(
                createSuccessResponse({ inflow }, 'Inflow updated successfully')
            );
    }
);

router.delete(
    '/:inflowId',
    processRequestParams(InflowParamsSchema),
    async (req, res) => {
        const user = authorizeRequest(req.headers.authorization);
        const { inflowId } = req.params;

        const [inflow] = await db
            .delete(inflowTable)
            .where(
                and(
                    eq(inflowTable.id, inflowId),
                    eq(inflowTable.userId, user.userId)
                )
            )
            .returning();

        return res
            .status(200)
            .json(
                createSuccessResponse({ inflow }, 'Inflow deleted successfully')
            );
    }
);
