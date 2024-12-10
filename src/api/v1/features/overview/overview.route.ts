import { and, eq, gte, lte } from 'drizzle-orm';
import { Router } from 'express';
import { validateRequestQuery } from 'zod-express-middleware';
import { db } from '../../../../db/index.js';
import { inflowTable } from '../../../../db/schema.js';
import { authorizeRequest } from '../../../../helpers/auth.helpers.js';
import { createSuccessResponse } from '../../../../helpers/response.helpers.js';
import { isDateRange, isValidDateString } from '../../../../lib/utils.js';
import { OverviewQuerySchema } from './overview.schema.js';

const router = Router();
export { router as overviewRoute };

router.get('/', validateRequestQuery(OverviewQuerySchema), async (req, res) => {
    const user = authorizeRequest(req.headers.authorization);
    const { date } = req.query;
    let periodString = '';

    const filters = [eq(inflowTable.userId, user.userId)];

    if (date && isValidDateString(date)) {
        filters.push(eq(inflowTable.createdAt, date));
        periodString = new Date(date).toLocaleDateString();
    } else if (date && isDateRange(date)) {
        const [startDate, endDate] = date.split('-');
        filters.push(
            gte(inflowTable.createdAt, startDate),
            lte(inflowTable.createdAt, endDate)
        );
        periodString = `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
    } else {
        filters.push(eq(inflowTable.createdAt, new Date().toISOString()));
        periodString = new Date().toLocaleDateString();
    }

    const inflows = await db.query.inflowTable.findMany({
        where: and(...filters),
        with: {
            category: true
        }
    });
    const outflows = await db.query.outflowTable.findMany({
        where: and(...filters),
        with: {
            category: true
        }
    });

    const totalInflowAmount = inflows.reduce(
        (total, inflow) => total + inflow.amount,
        0
    );
    const totalOutflowAmount = outflows.reduce(
        (total, outflow) => total + outflow.amount,
        0
    );
    const netExpense = totalInflowAmount - totalOutflowAmount;

    const lastFiveInflows = inflows.slice(0, 5);
    const lastFiveOutflows = outflows.slice(0, 5);

    const data = {
        totalInflowAmount,
        totalOutflowAmount,
        netExpense,
        lastFiveInflows,
        lastFiveOutflows,
        period: periodString
    };

    return res.status(200).json(createSuccessResponse(data));
});
