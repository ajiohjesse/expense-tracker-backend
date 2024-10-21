import express from 'express';
import { userRoute } from './routes/user.route.js';

const router = express.Router();
export { router as apiV1Route };

router.use('/users', userRoute);
