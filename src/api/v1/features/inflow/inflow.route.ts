import { Router } from 'express';

const router = Router();
export { router as inflowRoute };

router.get('/', (req, res) => {
    res.send('Hello World!');
});
