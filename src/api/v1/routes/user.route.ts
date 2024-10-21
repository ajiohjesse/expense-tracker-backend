import express, { type Router } from 'express';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';
import { db } from '@/db/index';
import { createSuccessResponse } from '@/helpers/response.helpers';

const router: Router = express.Router();

router.get('/', async (req, res) => {
    const foo = await db.query.fooTable.findMany();

    return res.status(200).json(
        createSuccessResponse({
            users: foo,
            meta: { total: 0, limit: 10, page: 1, nextPage: null, prevPage: null }
        })
    );
});

export { router as userRoute };
