import { Router } from 'express';

const router = Router();
export { router as outflowRoute };

router.get('/', (req, res) => {
    res.send('Hello World!');
});
