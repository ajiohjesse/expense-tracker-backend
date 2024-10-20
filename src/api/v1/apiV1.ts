import express, { type Router } from 'express';
import { userRoute } from './routes/user.route.ts';

const router: Router = express.Router();

router.use('/users', userRoute);

export { router as apiV1Route };
