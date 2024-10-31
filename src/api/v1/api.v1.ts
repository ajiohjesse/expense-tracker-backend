import express from 'express';
import { authRoute } from './features/auth/auth.route.js';
import { budgetRoute } from './features/budget/budget.route.js';
import { inflowRoute } from './features/inflow/inflow.route.js';
import { outflowRoute } from './features/outflow/outlflow.route.js';
import { userRoute } from './features/user/user.route.js';

const router = express.Router();
export { router as apiV1Route };

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/inflow', inflowRoute);
router.use('/outflow', outflowRoute);
router.use('/budget', budgetRoute);
