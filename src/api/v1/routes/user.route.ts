import { db } from '@/db/index.js';
import { createSuccessResponse } from '@/helpers/response.helpers.js';
import express, { type Router } from 'express';

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
