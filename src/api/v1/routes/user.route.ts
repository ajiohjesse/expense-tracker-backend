import { createSuccessResponse } from '@/lib/helpers.js';
import express, { type Router } from 'express';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';

const router: Router = express.Router();

router.get(
    '/',
    validateRequest({
        body: z.object({
            bodyKey: z.number()
        })
    }),
    (req, res) => {
        const body = req.body;

        return res.status(200).json(
            createSuccessResponse({
                users: [],
                meta: { total: 0, limit: 10, page: 1, nextPage: null, prevPage: null }
            })
        );
    }
);

export { router as userRoute };
