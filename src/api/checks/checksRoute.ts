import { createSuccessResponse } from '@/helpers/response.helpers.js';
import express from 'express';

const router = express.Router();
export { router as checksRoute };

router.get('/health', (_, res) => {
    return res.status(200).json(createSuccessResponse('Server is running'));
});

router.get('/env', (_, res) => {
    return res.status(200).json(
        createSuccessResponse({
            environment: process.env.NODE_ENV || null
        })
    );
});
